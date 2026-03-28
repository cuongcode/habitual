import { create } from 'zustand'
import type { Category, Habit, HabitEntry, HabitDayNote } from '../types/index'
import * as db from '../db/index'
import {
  getDayState as computeDayState,
  isTargetDate,
} from '../services/scheduleEngine'
import type { DayState } from '../services/scheduleEngine'
import { startOfDay, parseISO } from 'date-fns'

// ── Helpers ─────────────────────────────────────────────────────────

function noteKey(habitId: string, date: string): string {
  return `${habitId}_${date}`
}

// ── Seed data ───────────────────────────────────────────────────────

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', label: 'Health', colorKey: 'rust' },
  { id: 'cat-2', label: 'Focus', colorKey: 'brown' },
]

function makeSeedHabits(): Habit[] {
  const now = new Date().toISOString()
  return [
    {
      id: crypto.randomUUID(),
      name: 'Morning walk',
      categoryId: 'cat-1',
      schedule: { frequency: 'daily' },
      order: 0,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: 'Deep work session',
      categoryId: 'cat-2',
      schedule: { frequency: 'weekly', weekday: 4 },
      order: 0,
      createdAt: now,
    },
  ]
}

// ── Store interface ─────────────────────────────────────────────────

interface HabitStore {
  habits: Habit[]
  categories: Category[]
  entries: Record<string, HabitEntry[]>
  notes: Record<string, HabitDayNote>
  activeCategoryId: string | null
  setActiveCategoryId(id: string | null): void

  init(): Promise<void>

  addCategory(category: Omit<Category, 'id'>): Promise<void>
  deleteCategory(id: string): Promise<void>

  addHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Promise<void>
  updateHabit(id: string, updates: Partial<Habit>): Promise<void>
  deleteHabit(id: string): Promise<void>
  reorderHabits(categoryId: string, orderedIds: string[]): Promise<void>

  toggleEntry(habitId: string, date: string): Promise<void>

  saveNote(habitId: string, date: string, text: string): Promise<void>
  deleteNote(habitId: string, date: string): Promise<void>

  getHabitsByCategory(categoryId: string): Habit[]
  getDayState(habitId: string, date: string): DayState
  getNoteForHabitDate(habitId: string, date: string): HabitDayNote | undefined
}

// ── Store implementation ────────────────────────────────────────────

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  categories: [],
  entries: {},
  notes: {},
  activeCategoryId: null,
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),

  // ── Init ────────────────────────────────────────────────────────

  async init() {
    const [categories, habits] = await Promise.all([
      db.getAllCategories(),
      db.getAllHabits(),
    ])

    // Load all entries keyed by habitId
    const entries: Record<string, HabitEntry[]> = {}
    for (const habit of habits) {
      entries[habit.id] = await db.getEntriesForHabit(habit.id)
    }

    // Load all notes — we iterate habits and a date range isn't practical,
    // so we fetch from IDB directly via getAll and key them
    const allNotesRaw = await (async () => {
      const { openDB } = await import('idb')
      const idb = await openDB('habitual-db', 1)
      return idb.getAll('notes') as Promise<HabitDayNote[]>
    })()
    const notes: Record<string, HabitDayNote> = {}
    for (const note of allNotesRaw) {
      notes[noteKey(note.habitId, note.date)] = note
    }

    // Seed if empty
    if (habits.length === 0) {
      const seedCategories = SEED_CATEGORIES
      const seedHabits = makeSeedHabits()

      for (const cat of seedCategories) {
        await db.saveCategory(cat)
      }
      for (const habit of seedHabits) {
        await db.saveHabit(habit)
      }

      set({
        categories: seedCategories,
        habits: seedHabits,
        entries: {},
        notes: {},
      })
      return
    }

    set({ categories, habits, entries, notes })
  },

  // ── Categories ──────────────────────────────────────────────────

  async addCategory(data) {
    const category: Category = { ...data, id: crypto.randomUUID() }
    const prev = get().categories

    set({ categories: [...prev, category] })

    try {
      await db.saveCategory(category)
    } catch (err) {
      console.error('Failed to save category to IDB:', err)
      set({ categories: prev })
    }
  },

  async deleteCategory(id) {
    const prev = get().categories
    set({ categories: prev.filter((c) => c.id !== id) })

    try {
      await db.deleteCategory(id)
    } catch (err) {
      console.error('Failed to delete category from IDB:', err)
      set({ categories: prev })
    }
  },

  // ── Habits ──────────────────────────────────────────────────────

  async addHabit(data) {
    const habit: Habit = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const prev = get().habits

    set({ habits: [...prev, habit] })

    try {
      await db.saveHabit(habit)
    } catch (err) {
      console.error('Failed to save habit to IDB:', err)
      set({ habits: prev })
    }
  },

  async updateHabit(id, updates) {
    const prevHabits = get().habits
    const idx = prevHabits.findIndex((h) => h.id === id)
    if (idx === -1) return

    const updated = { ...prevHabits[idx], ...updates }
    const newHabits = [...prevHabits]
    newHabits[idx] = updated

    set({ habits: newHabits })

    try {
      await db.saveHabit(updated)
    } catch (err) {
      console.error('Failed to update habit in IDB:', err)
      set({ habits: prevHabits })
    }
  },

  async deleteHabit(id) {
    const prevHabits = get().habits
    set({ habits: prevHabits.filter((h) => h.id !== id) })

    try {
      await db.deleteHabit(id)
    } catch (err) {
      console.error('Failed to delete habit from IDB:', err)
      set({ habits: prevHabits })
    }
  },

  async reorderHabits(categoryId, orderedIds) {
    const prevHabits = get().habits
    const newHabits = prevHabits.map((h) => {
      if (h.categoryId !== categoryId) return h
      const order = orderedIds.indexOf(h.id)
      return order !== -1 ? { ...h, order } : h
    })

    set({ habits: newHabits })

    try {
      const updated = newHabits.filter((h) => h.categoryId === categoryId)
      await Promise.all(updated.map((h) => db.saveHabit(h)))
    } catch (err) {
      console.error('Failed to reorder habits in IDB:', err)
      set({ habits: prevHabits })
    }
  },

  // ── Entries ─────────────────────────────────────────────────────

  async toggleEntry(habitId, date) {
    const prevEntries = { ...get().entries }
    const habitEntries = prevEntries[habitId] ?? []
    const existing = habitEntries.find((e) => e.date === date)

    if (existing) {
      // Delete entry
      const updated = habitEntries.filter((e) => e.id !== existing.id)
      set({ entries: { ...prevEntries, [habitId]: updated } })

      try {
        await db.deleteEntry(existing.id)
      } catch (err) {
        console.error('Failed to delete entry from IDB:', err)
        set({ entries: prevEntries })
      }
    } else {
      // Create entry
      const habit = get().habits.find((h) => h.id === habitId)
      if (!habit) return

      const d = startOfDay(parseISO(date))
      const state = computeDayState(d, habit, habitEntries)
      const isBonus = state === 'window-empty' || state === 'future'

      const entry: HabitEntry = {
        id: crypto.randomUUID(),
        habitId,
        date,
        completed: true,
        isBonus: isBonus && !isTargetDate(d, habit.schedule, habit),
      }

      const updated = [...habitEntries, entry]
      set({ entries: { ...prevEntries, [habitId]: updated } })

      try {
        await db.saveEntry(entry)
      } catch (err) {
        console.error('Failed to save entry to IDB:', err)
        set({ entries: prevEntries })
      }
    }
  },

  // ── Notes ───────────────────────────────────────────────────────

  async saveNote(habitId, date, text) {
    const key = noteKey(habitId, date)
    const prevNotes = { ...get().notes }
    const existing = prevNotes[key]

    const note: HabitDayNote = existing
      ? { ...existing, text }
      : { id: crypto.randomUUID(), habitId, date, text }

    set({ notes: { ...prevNotes, [key]: note } })

    try {
      await db.saveNote(note)
    } catch (err) {
      console.error('Failed to save note to IDB:', err)
      set({ notes: prevNotes })
    }
  },

  async deleteNote(habitId, date) {
    const key = noteKey(habitId, date)
    const prevNotes = { ...get().notes }
    const existing = prevNotes[key]
    if (!existing) return

    const newNotes = { ...prevNotes }
    delete newNotes[key]
    set({ notes: newNotes })

    try {
      await db.deleteNote(existing.id)
    } catch (err) {
      console.error('Failed to delete note from IDB:', err)
      set({ notes: prevNotes })
    }
  },

  // ── Selectors ───────────────────────────────────────────────────

  getHabitsByCategory(categoryId) {
    return get()
      .habits.filter((h) => h.categoryId === categoryId)
      .sort((a, b) => a.order - b.order)
  },

  getDayState(habitId, date) {
    const habit = get().habits.find((h) => h.id === habitId)
    if (!habit) return 'future'
    const entries = get().entries[habitId] ?? []
    return computeDayState(startOfDay(parseISO(date)), habit, entries)
  },

  getNoteForHabitDate(habitId, date) {
    return get().notes[noteKey(habitId, date)]
  },
}))
