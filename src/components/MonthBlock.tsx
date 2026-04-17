import {
  addDays,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth
} from 'date-fns'
import { memo, useMemo } from 'react'
import { buildCompletedSet, getDayStateFast } from '../services/scheduleEngine'
import type { Habit, HabitEntry } from '../types/index'
import { getThemeTokens } from '../utils/theme'
import CalendarDayCell from './CalendarDayCell'

interface MonthBlockProps {
  year: number
  month: number // 1-indexed
  habit: Habit
  entries: HabitEntry[]
  notes: Record<string, any>
  isFirst?: boolean
  onLongPress: (dateStr: string) => void
  colorKey?: string
}

const MonthBlock = memo(({ 
  year, 
  month, 
  habit, 
  entries, 
  notes, 
  isFirst, 
  onLongPress,
  colorKey
}: MonthBlockProps) => {
  const completedSet = useMemo(() => buildCompletedSet(entries), [entries])
  const firstDay = startOfMonth(new Date(year, month - 1))
  const totalDays = getDaysInMonth(firstDay)
  
  // Offset: how many empty cells before the 1st
  // getDay() returns 0=Sun...6=Sat, convert to Mon-first:
  const offset = (getDay(firstDay) + 6) % 7

  const days = Array.from({ length: totalDays }, (_, i) => addDays(firstDay, i))
  const monthLabel = format(firstDay, 'MMMM yyyy')

  // To display the start of the month at the top and the end of the month at the bottom,
  // we just use the cells chronologically.
  const totalCells = offset + totalDays
  const remainder = totalCells % 7
  const paddingEnd = remainder === 0 ? 0 : 7 - remainder

  const allCells = [
    ...Array.from({ length: offset }).fill(null),
    ...days,
    ...Array.from({ length: paddingEnd }).fill(null)
  ]

  const tokens = getThemeTokens(colorKey)

  return (
    <div className="mb-6 [content-visibility:auto] [contain-intrinsic-size:auto_320px]">
      <div className={`px-4 py-3 flex justify-end border-t border-muted/10 ${isFirst ? 'border-t-0' : ''}`}>
        <span className={`text-[13px] ${tokens.text} font-display`}>
          {monthLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-px px-4">
        {allCells.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} className="aspect-square bg-transparent" />
          }
          
          const date = cell as Date
          const dateStr = format(date, 'yyyy-MM-dd')
          const state = getDayStateFast(date, habit, completedSet)
          const hasNote = !!notes[`${habit.id}_${dateStr}`]
          
          return (
            <CalendarDayCell
              key={dateStr}
              date={date}
              habit={habit}
              state={state}
              hasNote={hasNote}
              onLongPress={onLongPress}
              colorKey={colorKey}
            />
          )
        })}
      </div>
    </div>
  )
})

MonthBlock.displayName = 'MonthBlock'

export default MonthBlock
