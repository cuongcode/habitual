import { parseISO,startOfDay } from 'date-fns'
import { create } from 'zustand'

import * as db from '../db/index'
import type { DayState } from '../services/scheduleEngine'
import {
  getDayState as computeDayState,
  isTargetDate,
} from '../services/scheduleEngine'
import type { Category, Habit, HabitDayNote,HabitEntry } from '../types/index'

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
      id: 'h1',
      name: 'Morning walk',
      categoryId: 'cat-1',
      schedule: { frequency: 'daily' },
      order: 0,
      createdAt: now,
    },
    {
      id: 'h2',
      name: 'Drink water',
      categoryId: 'cat-1',
      schedule: { frequency: 'daily' },
      order: 1,
      createdAt: now,
    },
    {
      id: 'f1',
      name: 'Deep work session',
      categoryId: 'cat-2',
      schedule: { frequency: 'weekly', weekdays: [4] },
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

  addCategory(category: Category | Omit<Category, 'id'>): Promise<void>
  updateCategory(id: string, updates: Partial<Category>): Promise<void>
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
    try {
      const categories = await db.getAllCategories()
      let habits = await db.getAllHabits()

      // ── Stale Seed Cleanup ──────────────────────────────────────────
      const seedNames = ['Morning walk', 'Drink water', 'Deep work session']
      const stableIds = ['h1', 'h2', 'f1']
      
      let needsRefetch = false
      for (const h of habits) {
        if (seedNames.includes(h.name) && !stableIds.includes(h.id)) {
          await db.deleteHabit(h.id)
          needsRefetch = true
        }
      }
      
      if (needsRefetch) {
        habits = await db.getAllHabits()
      }

      // ── Data Migration: weekday → weekdays[] ────────────────────────
      for (const h of habits) {
        if (h.schedule.frequency === 'weekly' && 'weekday' in h.schedule) {
          const legacy = h.schedule as unknown as { frequency: 'weekly'; weekday: number }
          h.schedule = { frequency: 'weekly', weekdays: [legacy.weekday as 0|1|2|3|4|5|6] }
          await db.saveHabit(h)
        }
      }

      // ── Seeding ─────────────────────────────────────────────────────
      let finalCategories = [...categories]
      const finalHabits = [...habits]

      const hasSeeded = localStorage.getItem('habitual_has_seeded')
      if (!hasSeeded && categories.length === 0) {
        finalCategories = SEED_CATEGORIES
        for (const cat of finalCategories) {
          await db.saveCategory(cat)
        }
        localStorage.setItem('habitual_has_seeded', 'true')
      }

      // Only seed habits in development environment
      if (import.meta.env.DEV && !habits.some((h) => h.id === 'h1')) {
        const seedHabits = makeSeedHabits()
        for (const habit of seedHabits) {
          if (!habits.some((prev) => prev.id === habit.id)) {
            await db.saveHabit(habit)
            finalHabits.push(habit)
          }
        }
      }

      // ── Load Related Data ───────────────────────────────────────────
      const entries: Record<string, HabitEntry[]> = {}
      for (const habit of finalHabits) {
        entries[habit.id] = await db.getEntriesForHabit(habit.id)
      }

      const allNotesRaw = await db.getAllNotes()
      const notes: Record<string, HabitDayNote> = {}
      for (const note of allNotesRaw) {
        notes[noteKey(note.habitId, note.date)] = note
      }

      set({
        categories: finalCategories,
        habits: finalHabits,
        entries,
        notes,
      })
      console.log('✅ Habit store initialized')
    } catch (err) {
      console.error('❌ Failed to initialize habit store:', err)
      // Set some state so the app can at least render
      set({ categories: [], habits: [] })
    }
  },

  // ── Categories ──────────────────────────────────────────────────

  async addCategory(data) {
    const category: Category = 'id' in data ? data as Category : { ...data, id: crypto.randomUUID() }
    const prev = get().categories

    set({ categories: [...prev, category] })

    try {
      await db.saveCategory(category)
    } catch (err) {
      console.error('Failed to save category to IDB:', err)
      set({ categories: prev })
    }
  },

  async updateCategory(id, updates) {
    const prevCategories = get().categories
    const idx = prevCategories.findIndex((c) => c.id === id)
    if (idx === -1) return

    const updated = { ...prevCategories[idx], ...updates }
    const newCategories = [...prevCategories]
    newCategories[idx] = updated

    set({ categories: newCategories })

    try {
      await db.saveCategory(updated)
    } catch (err) {
      console.error('Failed to update category in IDB:', err)
      set({ categories: prevCategories })
    }
  },

  async deleteCategory(id) {
    const prevCategories = get().categories
    const prevHabits = get().habits
    
    const updatedHabits = prevHabits.map((h) => 
      h.categoryId === id ? { ...h, categoryId: 'none' } : h
    )

    set({ 
      categories: prevCategories.filter((c) => c.id !== id),
      habits: updatedHabits
    })

    try {
      await db.deleteCategory(id)
      const habitsToUpdate = updatedHabits.filter((_, i) => prevHabits[i].categoryId === id)
      await Promise.all(habitsToUpdate.map(h => db.saveHabit(h)))
    } catch (err) {
      console.error('Failed to delete category from IDB:', err)
      set({ categories: prevCategories, habits: prevHabits })
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

  async reorderHabits(_categoryId, newOrderedIds) {
    const prevHabits = get().habits

    const updatedHabits = prevHabits.map((habit) => {
      const newOrder = newOrderedIds.indexOf(habit.id)
      if (newOrder === -1) return habit
      return { ...habit, order: newOrder }
    })

    set({ habits: updatedHabits })

    try {
      const changedIds = new Set(newOrderedIds)
      const changedHabits = updatedHabits.filter((h) => changedIds.has(h.id))
      await Promise.all(changedHabits.map((h) => db.saveHabit(h)))
    } catch (err) {
      console.error('Failed to reorder habits in IDB:', err)
      set({ habits: prevHabits })
      console.log('--- STORE REVERTED DUE TO ERROR ---')
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
