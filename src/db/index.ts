import type { DBSchema, IDBPDatabase } from 'idb'
import { openDB } from 'idb'

import type { Category, Habit, HabitDayNote, HabitEntry, TrashItem } from '../types/index'

// ── Schema ──────────────────────────────────────────────────────────

interface HabitualDB extends DBSchema {
  categories: {
    key: string
    value: Category
  }
  habits: {
    key: string
    value: Habit
    indexes: { categoryId: string }
  }
  entries: {
    key: string
    value: HabitEntry
    indexes: {
      habitId: string
      date: string
      habitId_date: [string, string]
    }
  }
  notes: {
    key: string
    value: HabitDayNote
    indexes: { habitId_date: [string, string] }
  }
  trash: {
    key: string
    value: TrashItem
    indexes: { deletedAt: string }
  }
}

// ── Database singleton ──────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase<HabitualDB>> | null = null

export function getDB(): Promise<IDBPDatabase<HabitualDB>> {
  if (!dbPromise) {
    dbPromise = openDB<HabitualDB>('habitual-db', 3, {
      upgrade(db) {
        // Categories
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' })
        }

        // Habits
        if (!db.objectStoreNames.contains('habits')) {
          const habitStore = db.createObjectStore('habits', { keyPath: 'id' })
          habitStore.createIndex('categoryId', 'categoryId')
        }

        // Entries
        if (!db.objectStoreNames.contains('entries')) {
          const entryStore = db.createObjectStore('entries', { keyPath: 'id' })
          entryStore.createIndex('habitId', 'habitId')
          entryStore.createIndex('date', 'date')
          entryStore.createIndex('habitId_date', ['habitId', 'date'], {
            unique: true,
          })
        }

        // Notes
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' })
          noteStore.createIndex('habitId_date', ['habitId', 'date'], {
            unique: true,
          })
        }

        // Trash
        if (!db.objectStoreNames.contains('trash')) {
          const trashStore = db.createObjectStore('trash', { keyPath: 'id' })
          trashStore.createIndex('deletedAt', 'deletedAt')
        }
      },
    })
  }
  return dbPromise
}

// ── Categories ──────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB()
  return db.getAll('categories')
}

export async function saveCategory(category: Category): Promise<void> {
  const db = await getDB()
  await db.put('categories', category)
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('categories', id)
}

// ── Habits ──────────────────────────────────────────────────────────

export async function getAllHabits(): Promise<Habit[]> {
  const db = await getDB()
  return db.getAll('habits')
}

export async function saveHabit(habit: Habit): Promise<void> {
  const db = await getDB()
  await db.put('habits', habit)
}

export async function deleteHabit(id: string): Promise<void> {
  const db = await getDB()
  const entries = await db.getAllFromIndex('entries', 'habitId', id)
  const notes = await db.getAll('notes')
  const notesToDelete = notes.filter((n) => n.habitId === id)

  const tx = db.transaction(['habits', 'entries', 'notes'], 'readwrite')
  tx.objectStore('habits').delete(id)
  
  for (const e of entries) {
    tx.objectStore('entries').delete(e.id)
  }
  for (const n of notesToDelete) {
    tx.objectStore('notes').delete(n.id)
  }
  
  await tx.done
}

// ── Entries ─────────────────────────────────────────────────────────

export async function getAllEntries(): Promise<HabitEntry[]> {
  const db = await getDB()
  return db.getAll('entries')
}

export async function getEntriesForHabit(habitId: string): Promise<HabitEntry[]> {
  const db = await getDB()
  return db.getAllFromIndex('entries', 'habitId', habitId)
}

export async function getEntryForHabitDate(
  habitId: string,
  date: string,
): Promise<HabitEntry | undefined> {
  const db = await getDB()
  return db.getFromIndex('entries', 'habitId_date', [habitId, date])
}

export async function saveEntry(entry: HabitEntry): Promise<void> {
  const db = await getDB()
  await db.put('entries', entry)
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('entries', id)
}

export async function getAllNotes(): Promise<HabitDayNote[]> {
  const db = await getDB()
  return db.getAll('notes')
}

// ── Notes ───────────────────────────────────────────────────────────

export async function getNoteForHabitDate(
  habitId: string,
  date: string,
): Promise<HabitDayNote | undefined> {
  const db = await getDB()
  return db.getFromIndex('notes', 'habitId_date', [habitId, date])
}

export async function saveNote(note: HabitDayNote): Promise<void> {
  const db = await getDB()
  await db.put('notes', note)
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notes', id)
}

// ── Trash ───────────────────────────────────────────────────────────

export async function saveTrashItem(item: TrashItem): Promise<void> {
  const db = await getDB()
  await db.put('trash', item)
}

export async function getAllTrashItems(): Promise<TrashItem[]> {
  const db = await getDB()
  return db.getAll('trash')
}

export async function getTrashItem(id: string): Promise<TrashItem | undefined> {
  const db = await getDB()
  return db.get('trash', id)
}

export async function deleteTrashItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('trash', id)
}

export async function purgeExpiredTrash(maxAgeDays: number): Promise<number> {
  const db = await getDB()
  const all = await db.getAll('trash')
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  const expired = all.filter((item) => new Date(item.deletedAt).getTime() < cutoff)

  if (expired.length > 0) {
    const tx = db.transaction('trash', 'readwrite')
    for (const item of expired) {
      tx.objectStore('trash').delete(item.id)
    }
    await tx.done
  }

  return expired.length
}

export async function clearAllTrash(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('trash', 'readwrite')
  await tx.objectStore('trash').clear()
  await tx.done
}
