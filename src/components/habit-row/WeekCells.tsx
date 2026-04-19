import { format, startOfDay, subDays } from 'date-fns'
import type { Habit, HabitEntry } from '@/types'
import { getDayState } from '@/services/scheduleEngine'
import { InteractiveDayCell } from './InteractiveDayCell'

interface WeekCellsProps {
  habit: Habit
  entries: HabitEntry[]
  hasNote: (dateStr: string) => boolean
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
}

export function WeekCells({
  habit,
  entries,
  hasNote,
  setNoteModalDate,
  colorKey,
}: WeekCellsProps) {
  const today = startOfDay(new Date())
  const cellDates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))

  return (
    <div className="mode-fade flex shrink-0 gap-1">
      {cellDates.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const state = getDayState(date, habit, entries)

        return (
          <InteractiveDayCell
            key={dateStr}
            habitId={habit.id}
            date={date}
            dateStr={dateStr}
            state={state}
            hasNote={hasNote(dateStr)}
            setNoteModalDate={setNoteModalDate}
            colorKey={colorKey}
          />
        )
      })}
    </div>
  )
}
