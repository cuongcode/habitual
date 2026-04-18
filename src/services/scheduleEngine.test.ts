import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import type { Habit, HabitEntry, Schedule } from '../types/index'
import { getDayState,isTargetDate } from './scheduleEngine'

// ── Helpers ──────────────────────────────────────────────────────────

function makeHabit(schedule: Schedule, id = 'h-1'): Habit {
  return {
    id,
    name: 'Test habit',
    categoryId: 'cat-1',
    schedule,
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

function makeEntry(
  habitId: string,
  date: string,
  completed = true,
): HabitEntry {
  return {
    id: `entry-${date}`,
    habitId,
    date,
    completed,
    isBonus: false,
  }
}

// ── isTargetDate ─────────────────────────────────────────────────────

describe('isTargetDate', () => {
  const habit = makeHabit({ frequency: 'daily' })

  describe('daily', () => {
    const schedule: Schedule = { frequency: 'daily' }

    it('every day is a target', () => {
      expect(isTargetDate(new Date('2026-03-25'), schedule, habit)).toBe(true)
      expect(isTargetDate(new Date('2026-03-26'), schedule, habit)).toBe(true)
    })
  })

  describe('weekly — single day', () => {
    // weekdays [4] = Thursday only
    const schedule: Schedule = { frequency: 'weekly', weekdays: [4] }

    it('returns true on matching weekday (Thursday)', () => {
      expect(isTargetDate(new Date('2026-03-26'), schedule, habit)).toBe(true) // Thu
    })

    it('returns false on non-matching weekday (Wednesday)', () => {
      expect(isTargetDate(new Date('2026-03-25'), schedule, habit)).toBe(false) // Wed
    })
  })

  describe('weekly — two days (Mon + Thu)', () => {
    // weekdays [1, 4] = Monday + Thursday
    const schedule: Schedule = { frequency: 'weekly', weekdays: [1, 4] }

    it('returns true on Monday', () => {
      expect(isTargetDate(new Date('2026-03-23'), schedule, habit)).toBe(true) // Mon
    })

    it('returns true on Thursday', () => {
      expect(isTargetDate(new Date('2026-03-26'), schedule, habit)).toBe(true) // Thu
    })

    it('returns false on Wednesday (between targets)', () => {
      expect(isTargetDate(new Date('2026-03-25'), schedule, habit)).toBe(false) // Wed
    })

    it('returns false on Sunday', () => {
      expect(isTargetDate(new Date('2026-03-22'), schedule, habit)).toBe(false) // Sun
    })
  })

  describe('weekly — three days (Mon, Wed, Fri)', () => {
    // weekdays [1, 3, 5] = Mon, Wed, Fri
    const schedule: Schedule = { frequency: 'weekly', weekdays: [1, 3, 5] }

    it('returns true on Monday', () => {
      expect(isTargetDate(new Date('2026-03-23'), schedule, habit)).toBe(true) // Mon
    })

    it('returns true on Wednesday', () => {
      expect(isTargetDate(new Date('2026-03-25'), schedule, habit)).toBe(true) // Wed
    })

    it('returns true on Friday', () => {
      expect(isTargetDate(new Date('2026-03-27'), schedule, habit)).toBe(true) // Fri
    })

    it('returns false on Tuesday (gap between Mon and Wed)', () => {
      expect(isTargetDate(new Date('2026-03-24'), schedule, habit)).toBe(false) // Tue
    })

    it('returns false on weekend', () => {
      expect(isTargetDate(new Date('2026-03-22'), schedule, habit)).toBe(false) // Sun
      expect(isTargetDate(new Date('2026-03-28'), schedule, habit)).toBe(false) // Sat
    })
  })

  describe('monthly', () => {
    const schedule: Schedule = { frequency: 'monthly', dayOfMonth: 15 }

    it('returns true on matching day of month', () => {
      expect(isTargetDate(new Date('2026-03-15'), schedule, habit)).toBe(true)
    })

    it('returns false on non-matching day of month', () => {
      expect(isTargetDate(new Date('2026-03-14'), schedule, habit)).toBe(false)
    })
  })

  describe('yearly', () => {
    // month: 3 = March (1-indexed)
    const schedule: Schedule = { frequency: 'yearly', month: 3, dayOfMonth: 3 }

    it('returns true on matching month + day', () => {
      expect(isTargetDate(new Date('2026-03-03'), schedule, habit)).toBe(true)
    })

    it('returns false on wrong month', () => {
      expect(isTargetDate(new Date('2026-04-03'), schedule, habit)).toBe(false)
    })
  })

  describe('custom', () => {
    const schedule: Schedule = {
      frequency: 'custom',
      intervalDays: 14,
      anchorDate: '2026-03-20',
    }

    it('returns true on anchor date itself', () => {
      expect(isTargetDate(new Date('2026-03-20'), schedule, habit)).toBe(true)
    })

    it('returns true 14 days after anchor', () => {
      expect(isTargetDate(new Date('2026-04-03'), schedule, habit)).toBe(true)
    })

    it('returns false one day after anchor', () => {
      expect(isTargetDate(new Date('2026-03-21'), schedule, habit)).toBe(false)
    })

    it('returns false before anchor', () => {
      expect(isTargetDate(new Date('2026-03-19'), schedule, habit)).toBe(false)
    })
  })
})

// ── getDayState ──────────────────────────────────────────────────────

describe('getDayState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Pin "today" to Wednesday 2026-03-25
    vi.setSystemTime(new Date('2026-03-25T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('weekly habit (single day) with completed entry', () => {
    // Weekly on Thursday (weekdays: [4])
    const habit = makeHabit({ frequency: 'weekly', weekdays: [4] })
    // Thursday 2026-03-19 was completed
    const entries = [makeEntry(habit.id, '2026-03-19')]

    it('target date with entry → target-complete', () => {
      expect(getDayState(new Date('2026-03-19'), habit, entries)).toBe(
        'target-complete',
      )
    })

    it('Friday after completed Thursday → window-on', () => {
      expect(getDayState(new Date('2026-03-20'), habit, entries)).toBe(
        'window-on',
      )
    })

    it('Tuesday in window → window-on', () => {
      expect(getDayState(new Date('2026-03-24'), habit, entries)).toBe(
        'window-on',
      )
    })

    it('today Wednesday in window → window-on', () => {
      expect(getDayState(new Date('2026-03-25'), habit, entries)).toBe(
        'window-on',
      )
    })

    it('next Thursday → future', () => {
      expect(getDayState(new Date('2026-03-26'), habit, entries)).toBe(
        'future',
      )
    })
  })

  describe('weekly habit (single day) with no entries (missed)', () => {
    const habit = makeHabit({ frequency: 'weekly', weekdays: [4] })
    const entries: HabitEntry[] = []

    it('past Thursday with no check → target-missed', () => {
      expect(getDayState(new Date('2026-03-19'), habit, entries)).toBe(
        'target-missed',
      )
    })

    it('today Wednesday in missed window → window-empty', () => {
      expect(getDayState(new Date('2026-03-25'), habit, entries)).toBe(
        'window-empty',
      )
    })

    it('next Thursday → future', () => {
      expect(getDayState(new Date('2026-03-26'), habit, entries)).toBe(
        'future',
      )
    })
  })

  describe('weekly habit — two days (Mon + Thu), today is Wed 2026-03-25', () => {
    // Mon Mar 23 and Thu Mar 26 are target days; today is Wed Mar 25
    const habit = makeHabit({ frequency: 'weekly', weekdays: [1, 4] })

    it('Mon 2026-03-23 completed → target-complete', () => {
      const entries = [makeEntry(habit.id, '2026-03-23')]
      expect(getDayState(new Date('2026-03-23'), habit, entries)).toBe('target-complete')
    })

    it('Mon 2026-03-23 missed → target-missed', () => {
      expect(getDayState(new Date('2026-03-23'), habit, [])).toBe('target-missed')
    })

    it('Tue 2026-03-24 (non-target, after missed Mon) → window-empty', () => {
      expect(getDayState(new Date('2026-03-24'), habit, [])).toBe('window-empty')
    })

    it('Wed 2026-03-25 (today, non-target) → window-empty', () => {
      expect(getDayState(new Date('2026-03-25'), habit, [])).toBe('window-empty')
    })

    it('Thu 2026-03-26 (next target) → future', () => {
      expect(getDayState(new Date('2026-03-26'), habit, [])).toBe('future')
    })
  })

  describe('daily habit', () => {
    const habit = makeHabit({ frequency: 'daily' })
    const entries = [makeEntry(habit.id, '2026-03-24')]

    it('yesterday with entry → target-complete', () => {
      expect(getDayState(new Date('2026-03-24'), habit, entries)).toBe(
        'target-complete',
      )
    })

    it('today with no entry → target-open', () => {
      expect(getDayState(new Date('2026-03-25'), habit, entries)).toBe(
        'target-open',
      )
    })

    it('tomorrow → future', () => {
      expect(getDayState(new Date('2026-03-26'), habit, entries)).toBe(
        'future',
      )
    })
  })
})
