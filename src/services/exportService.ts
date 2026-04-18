import { format } from 'date-fns'

import { getAllCategories, getAllEntries, getAllHabits, getAllNotes, getDB } from '../db/index'
import type { Category, Habit, HabitDayNote,HabitEntry } from '../types/index'

export interface ExportPayload {
  version: 1
  exportedAt: string          // ISO datetime string
  categories: Category[]
  habits: Habit[]
  entries: HabitEntry[]
  notes: HabitDayNote[]
}

export async function exportData(): Promise<void> {
  const [categories, habits, entries, notes] = await Promise.all([
    getAllCategories(),
    getAllHabits(),
    getAllEntries(),
    getAllNotes(),
  ])

  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    habits,
    entries,
    notes,
  }

  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Trigger file download
  const a = document.createElement('a')
  a.href = url
  a.download = `habitual-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export type ImportMode = 'merge' | 'replace'

export interface ImportResult {
  success: boolean
  imported: {
    categories: number
    habits: number
    entries: number
    notes: number
  }
  error?: string
}

export async function importData(
  file: File,
  mode: ImportMode
): Promise<ImportResult> {
  try {
    const text = await file.text()
    const payload = JSON.parse(text) as ExportPayload

    // Validate structure
    if (payload.version !== 1) {
      return { success: false, imported: { categories: 0, habits: 0, entries: 0, notes: 0 }, error: 'Unsupported file version.' }
    }
    if (!Array.isArray(payload.habits) || !Array.isArray(payload.entries)) {
      return { success: false, imported: { categories: 0, habits: 0, entries: 0, notes: 0 }, error: 'Invalid file format.' }
    }

    const db = await getDB()

    if (mode === 'replace') {
      // Clear all existing data first
      const tx = db.transaction(
        ['categories', 'habits', 'entries', 'notes'],
        'readwrite'
      )
      await Promise.all([
        tx.objectStore('categories').clear(),
        tx.objectStore('habits').clear(),
        tx.objectStore('entries').clear(),
        tx.objectStore('notes').clear(),
      ])
      await tx.done
    }

    // Write imported data
    // In merge mode: existing records with same id are overwritten, new ones are added
    const writeTx = db.transaction(
      ['categories', 'habits', 'entries', 'notes'],
      'readwrite'
    )
    await Promise.all([
      ...payload.categories.map(c => writeTx.objectStore('categories').put(c)),
      ...payload.habits.map(h => writeTx.objectStore('habits').put(h)),
      ...payload.entries.map(e => writeTx.objectStore('entries').put(e)),
      ...(payload.notes ?? []).map(n => writeTx.objectStore('notes').put(n)),
    ])
    await writeTx.done

    return {
      success: true,
      imported: {
        categories: payload.categories.length,
        habits: payload.habits.length,
        entries: payload.entries.length,
        notes: payload.notes?.length ?? 0,
      },
    }
  } catch (e) {
    return {
      success: false,
      imported: { categories: 0, habits: 0, entries: 0, notes: 0 },
      error: 'Could not read file. Make sure it is a valid Habitual backup.',
    }
  }
}
