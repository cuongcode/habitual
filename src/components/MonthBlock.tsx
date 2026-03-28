import { memo } from 'react'
import { 
  format, 
  startOfMonth, 
  getDaysInMonth, 
  getDay, 
  addDays 
} from 'date-fns'
import type { Habit, HabitEntry } from '../types/index'
import { getDayState } from '../services/scheduleEngine'
import CalendarDayCell from './CalendarDayCell'

interface MonthBlockProps {
  year: number
  month: number // 1-indexed
  habit: Habit
  entries: HabitEntry[]
  notes: Record<string, any>
  isFirst?: boolean
  onLongPress: (dateStr: string) => void
}

const MonthBlock = memo(({ 
  year, 
  month, 
  habit, 
  entries, 
  notes, 
  isFirst, 
  onLongPress 
}: MonthBlockProps) => {
  const firstDay = startOfMonth(new Date(year, month - 1))
  const totalDays = getDaysInMonth(firstDay)
  
  // Offset: how many empty cells before the 1st
  // getDay() returns 0=Sun...6=Sat, convert to Mon-first:
  const offset = (getDay(firstDay) + 6) % 7

  const days = Array.from({ length: totalDays }, (_, i) => addDays(firstDay, i))
  const monthLabel = format(firstDay, 'MMMM yyyy')

  return (
    <div className="mb-6">
      <div className={`px-4 py-3 flex justify-end border-t border-muted/10 ${isFirst ? 'border-t-0' : ''}`}>
        <span className="text-[13px] text-rust font-display" style={{ fontFamily: 'var(--font-display)' }}>
          {monthLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-px px-4">
        {/* Render offset empty cells */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`offset-${i}`} className="aspect-square bg-transparent" />
        ))}
        
        {/* Render day cells */}
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const state = getDayState(date, habit, entries)
          const hasNote = !!notes[`${habit.id}_${dateStr}`]
          
          return (
            <CalendarDayCell
              key={dateStr}
              date={date}
              habit={habit}
              state={state}
              hasNote={hasNote}
              onLongPress={onLongPress}
            />
          )
        })}
      </div>
    </div>
  )
})

MonthBlock.displayName = 'MonthBlock'

export default MonthBlock
