import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isTargetDate, getDayState } from './scheduleEngine'
import type { Habit, HabitEntry, Schedule } from '../types/index'

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

  describe('weekly', () => {
    // weekday 4 = Thursday
    const schedule: Schedule = { frequency: 'weekly', weekday: 4 }

    it('returns true on matching weekday (Thursday)', () => {
      expect(isTargetDate(new Date('2026-03-26'), schedule, habit)).toBe(true) // Thu
    })

    it('returns false on non-matching weekday (Wednesday)', () => {
      expect(isTargetDate(new Date('2026-03-25'), schedule, habit)).toBe(false) // Wed
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

  describe('weekly habit with completed entry', () => {
    // Weekly on Thursday (weekday 4)
    const habit = makeHabit({ frequency: 'weekly', weekday: 4 })
    // Thursday 2026-03-19 was completed
    const entries = [makeEntry(habit.id, '2026-03-19')]

    it('target date with entry → target-complete', () => {
      expect(getDayState(new Date('2026-03-19'), habit, entries)).toBe(
        'target-complete',
      )
    })

    it('Friday after completed Thursday → window-empty', () => {
      expect(getDayState(new Date('2026-03-20'), habit, entries)).toBe(
        'window-empty',
      )
    })

    it('Tuesday in window → window-empty', () => {
      expect(getDayState(new Date('2026-03-24'), habit, entries)).toBe(
        'window-empty',
      )
    })

    it('today Wednesday in window → window-empty', () => {
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

  describe('weekly habit with no entries (missed)', () => {
    const habit = makeHabit({ frequency: 'weekly', weekday: 4 })
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
