import {
  addDays,
  endOfMonth,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'

import type { Habit, HabitEntry } from '../types'
import {
  getNextTargetDate,
  getPrevTargetDate,
} from './scheduleEngine'

export interface MonthlyRate {
  label: string // 'Jan', 'Feb' etc — IBM Plex Mono
  year: number
  month: number // 1-indexed
  completed: number
  total: number
  rate: number // 0.0 – 1.0
}

/**
 * All target dates from habit.createdAt up to today (inclusive).
 */
export function getTargetDates(habit: Habit, upTo: Date): Date[] {
  const start = startOfDay(parseISO(habit.createdAt))
  const end = startOfDay(upTo)
  const targets: Date[] = []

  let current = getNextTargetDate(start, habit.schedule, habit)
  while (current && !isAfter(current, end)) {
    targets.push(current)
    const next = getNextTargetDate(addDays(current, 1), habit.schedule, habit)
    if (isSameDay(next, current)) break
    current = next
  }

  return targets
}

/**
 * All target dates that have a completed entry.
 */
export function getCompletedTargetDates(
  habit: Habit,
  entries: HabitEntry[],
): Date[] {
  const targetDates = getTargetDates(habit, new Date())
  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )

  return targetDates.filter((d) => completedDates.has(format(d, 'yyyy-MM-dd')))
}

/**
 * Current streak: consecutive completed targets ending on the most recent target on or before today.
 */
export function getCurrentStreak(habit: Habit, entries: HabitEntry[]): number {
  const today = new Date()
  const lastTarget = getPrevTargetDate(today, habit.schedule, habit)
  if (isAfter(lastTarget, today)) return 0 // Should not happen with getPrevTargetDate, but safety first

  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )

  let streak = 0
  let current = lastTarget

  // If the habit was created after the last target, there's no streak yet
  if (isBefore(current, parseISO(habit.createdAt))) return 0

  while (true) {
    if (completedDates.has(format(current, 'yyyy-MM-dd'))) {
      streak++
      const next = getPrevTargetDate(subDays(current, 1), habit.schedule, habit)
      if (isSameDay(next, current)) break
      current = next
      // Stop if we go before habit creation
      if (isBefore(current, parseISO(habit.createdAt))) break
    } else {
      break
    }
  }

  return streak
}

/**
 * Longest streak: longest consecutive run of completed target dates in history.
 */
export function getLongestStreak(habit: Habit, entries: HabitEntry[]): number {
  const targets = getTargetDates(habit, new Date())
  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )

  let maxStreak = 0
  let currentStreak = 0

  for (const date of targets) {
    if (completedDates.has(format(date, 'yyyy-MM-dd'))) {
      currentStreak++
      if (currentStreak > maxStreak) maxStreak = currentStreak
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

/**
 * Completion rate: completed targets / total targets from createdAt to today.
 */
export function getCompletionRate(habit: Habit, entries: HabitEntry[]): number {
  const targets = getTargetDates(habit, new Date())
  if (targets.length === 0) return 0

  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )
  const completedCount = targets.filter((d) =>
    completedDates.has(format(d, 'yyyy-MM-dd')),
  ).length

  return completedCount / targets.length
}

/**
 * Best period: { start: Date, end: Date } of the longest streak window.
 */
export function getBestPeriod(
  habit: Habit,
  entries: HabitEntry[],
): { start: Date; end: Date } | null {
  const targets = getTargetDates(habit, new Date())
  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )

  let maxStreak = 0
  let currentStreak = 0
  let bestStart: Date | null = null
  let bestEnd: Date | null = null
  let tempStart: Date | null = null

  for (const date of targets) {
    if (completedDates.has(format(date, 'yyyy-MM-dd'))) {
      if (currentStreak === 0) tempStart = date
      currentStreak++
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak
        bestStart = tempStart
        bestEnd = date
      }
    } else {
      currentStreak = 0
    }
  }

  if (maxStreak === 0 || !bestStart || !bestEnd) return null

  return { start: bestStart, end: bestEnd }
}

/**
 * Total completed entries where isBonus = false.
 */
export function getTotalCompletions(
  _habit: Habit,
  entries: HabitEntry[],
): number {
  return entries.filter((e) => e.completed && !e.isBonus).length
}

/**
 * Per-month completion rate for the last N months.
 */
export function getMonthlyRates(
  habit: Habit,
  entries: HabitEntry[],
  monthCount: number,
): MonthlyRate[] {
  const result: MonthlyRate[] = []
  const today = new Date()
  const completedDates = new Set(
    entries.filter((e) => e.completed).map((e) => e.date),
  )

  for (let i = 0; i < monthCount; i++) {
    const monthDate = subMonths(today, i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const habitCreated = parseISO(habit.createdAt)

    // Calculate start/end of the window to count targets
    // It should be within the month but not before habit.createdAt and not after today
    const countStart = isAfter(monthStart, habitCreated)
      ? monthStart
      : habitCreated
    const countEnd = isBefore(monthEnd, today) ? monthEnd : today

    let totalTargets = 0
    let completedTargets = 0

    if (countStart <= countEnd) {
      // Find all target dates in this month's window
      let current = getNextTargetDate(countStart, habit.schedule, habit)
      while (current && !isAfter(current, countEnd)) {
        totalTargets++
        if (completedDates.has(format(current, 'yyyy-MM-dd'))) {
          completedTargets++
        }
        const next = getNextTargetDate(addDays(current, 1), habit.schedule, habit)
        if (isSameDay(next, current)) break // Safety break
        current = next
      }
    }

    result.push({
      label: format(monthDate, 'MMM'),
      year: getYear(monthDate),
      month: getMonth(monthDate) + 1,
      completed: completedTargets,
      total: totalTargets,
      rate: totalTargets > 0 ? completedTargets / totalTargets : 0,
    })
  }

  return result
}
