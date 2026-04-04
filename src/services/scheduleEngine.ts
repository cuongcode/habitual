import {
  startOfDay,
  addDays,
  subDays,
  differenceInCalendarDays,
  parseISO,
  getDay,
  getDate,
  getMonth,
} from 'date-fns'
import type { Schedule, Habit, HabitEntry } from '../types/index'

// ── DayState ────────────────────────────────────────────────────────

export type DayState =
  | 'target-open' // target date, not yet completed
  | 'target-complete' // target date, completed
  | 'target-missed' // target date, no entry, date is in the past
  | 'window-empty' // non-target, previous target missed, no entry
  | 'window-on' // non-target, previous target completed, no entry
  | 'window-bonus' // non-target, has completed entry
  | 'future' // date is after today (still fully interactive)

// ── Schedule helpers ────────────────────────────────────────────────

/**
 * Returns true if `date` is a target date for the given schedule.
 */
export function isTargetDate(
  date: Date,
  schedule: Schedule,
  _habit: Habit,
): boolean {
  const d = startOfDay(date)

  switch (schedule.frequency) {
    case 'daily':
      return true

    case 'weekly':
      return getDay(d) === schedule.weekday

    case 'monthly':
      return getDate(d) === schedule.dayOfMonth

    case 'yearly':
      return (
        getMonth(d) + 1 === schedule.month && getDate(d) === schedule.dayOfMonth
      )

    case 'custom': {
      const anchor = startOfDay(parseISO(schedule.anchorDate))
      const diff = differenceInCalendarDays(d, anchor)
      return diff >= 0 && diff % schedule.intervalDays === 0
    }
  }
}

/**
 * Returns the next target date on or after `fromDate`.
 */
export function getNextTargetDate(
  fromDate: Date,
  schedule: Schedule,
  habit: Habit,
): Date {
  let d = startOfDay(fromDate)
  // Safety limit: scan up to 400 days
  for (let i = 0; i < 400; i++) {
    if (isTargetDate(d, schedule, habit)) return d
    d = addDays(d, 1)
  }
  return d // fallback
}

/**
 * Returns the most recent target date on or before `fromDate`.
 */
export function getPrevTargetDate(
  fromDate: Date,
  schedule: Schedule,
  habit: Habit,
): Date {
  let d = startOfDay(fromDate)
  // Safety limit: scan up to 400 days
  for (let i = 0; i < 400; i++) {
    if (isTargetDate(d, schedule, habit)) return d
    d = subDays(d, 1)
  }
  return d // fallback
}

// ── Master getDayState ──────────────────────────────────────────────

function hasCompletedEntry(entries: HabitEntry[], dateStr: string): boolean {
  return entries.some((e) => e.date === dateStr && e.completed)
}

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Master function — all UI derives from this.
 */
export function getDayState(
  date: Date,
  habit: Habit,
  entries: HabitEntry[],
): DayState {
  const d = startOfDay(date)
  const today = startOfDay(new Date())
  const dateStr = toDateStr(d)
  const isTarget = isTargetDate(d, habit.schedule, habit)

  if (isTarget) {
    if (hasCompletedEntry(entries, dateStr)) return 'target-complete'
    if (d > today) return 'future'
    if (d.getTime() === today.getTime()) return 'target-open'
    return 'target-missed'
  }

  // Non-target date
  if (d > today) return 'future'

  // Window bonus triggers if the non-target cell is completed, regardless of previous target
  if (hasCompletedEntry(entries, dateStr)) return 'window-bonus'

  // Find the most recent past target date
  const prevTarget = getPrevTargetDate(subDays(d, 1), habit.schedule, habit)
  const prevTargetStr = toDateStr(prevTarget)

  if (hasCompletedEntry(entries, prevTargetStr)) {
    // Previous target was completed — this is a "window-on" day
    return 'window-on'
  }

  // Previous target was missed
  return 'window-empty'
}
