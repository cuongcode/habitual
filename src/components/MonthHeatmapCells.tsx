import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from 'date-fns'
import React, { useMemo } from 'react'

import { getDayState } from '@/services/scheduleEngine'
import { useUIStore } from '@/store/uiStore'
import type { Habit, HabitEntry } from '@/types'
import { MonthCell } from './MonthCell'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/en'

const CELL_SIZE = 28
const GAP = 2

interface MonthHeatmapCellsProps {
  habit: Habit
  entries: HabitEntry[]
  hasNote: (dateStr: string) => boolean
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
}

export const MonthHeatmapCells = React.memo(function MonthHeatmapCells({
  habit,
  entries,
  hasNote,
  setNoteModalDate,
  colorKey,
}: MonthHeatmapCellsProps) {
  const year = useUIStore((state) => state.heatmapYear)
  const month = useUIStore((state) => state.heatmapMonth)
  const { t } = useTranslation()

  const DAY_KEYS: TranslationKey[] = [
    'weekdayMonShort',
    'weekdayTueShort',
    'weekdayWedShort',
    'weekdayThuShort',
    'weekdayFriShort',
    'weekdaySatShort',
    'weekdaySunShort',
  ]

  const { days, offset } = useMemo(() => {
    const start = startOfMonth(new Date(year, month - 1, 1))
    const end = endOfMonth(start)
    const days = eachDayOfInterval({ start, end })
    // Convert to Monday-first offset (0 = Mon ... 6 = Sun)
    const rawDay = getDay(start) // 0 = Sun, 1 = Mon ... 6 = Sat
    const offset = rawDay === 0 ? 6 : rawDay - 1
    return { days, offset }
  }, [year, month])

  // Trailing invisible cells to complete the last row
  const totalCells = offset + days.length
  const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)

  return (
    <div style={{ width: 7 * CELL_SIZE + 6 * GAP }} className="mode-fade">
      {/* Mon–Sun column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(7, ${CELL_SIZE}px)`,
          gap: GAP,
          marginBottom: GAP,
        }}
      >
        {DAY_KEYS.map((key, i) => (
          <div
            key={i}
            className="text-center font-mono text-muted-light"
            style={{ fontSize: 9, height: 12, lineHeight: '12px' }}
          >
            {t(key)}
          </div>
        ))}
      </div>

      {/* Cell grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(7, ${CELL_SIZE}px)`,
          gap: GAP,
        }}
      >
        {/* Leading invisible offset cells */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`pre-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
        ))}

        {/* Day cells */}
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const state = getDayState(date, habit, entries)
          const today = isToday(date)

          return (
            <MonthCell
              key={dateStr}
              date={date}
              dateStr={dateStr}
              dayState={state}
              hasNote={hasNote(dateStr)}
              isToday={today}
              habitId={habit.id}
              setNoteModalDate={setNoteModalDate}
              colorKey={colorKey}
            />
          )
        })}

        {/* Trailing invisible cells */}
        {Array.from({ length: trailing }).map((_, i) => (
          <div key={`post-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
        ))}
      </div>
    </div>
  )
})
