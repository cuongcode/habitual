export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

export type Schedule =
  | { frequency: 'daily' }
  | { frequency: 'weekly'; weekdays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[] } // 1–6 items
  | { frequency: 'monthly'; dayOfMonth: number }
  | { frequency: 'yearly'; month: number; dayOfMonth: number }
  | { frequency: 'custom'; intervalDays: number; anchorDate: string }

export interface Category {
  id: string
  label: string
  colorKey: string
}

export interface Habit {
  id: string
  name: string
  categoryId: string
  schedule: Schedule
  reminderTime?: string // 'HH:mm' format, optional
  order: number // per-category sort order
  createdAt: string // ISO date string
}

export interface HabitEntry {
  id: string
  habitId: string
  date: string // ISO date string 'YYYY-MM-DD'
  completed: boolean
  isBonus: boolean // true if checked on a window/non-target day
}

export interface HabitDayNote {
  id: string
  habitId: string
  date: string // ISO date string 'YYYY-MM-DD'
  text: string // max 280 characters
}

export interface TrashItem {
  id: string // same as the original habit ID
  deletedAt: string // ISO datetime — used to calculate 30-day expiry
  habit: Habit
  entries: HabitEntry[]
  notes: HabitDayNote[]
}
