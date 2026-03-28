import { memo } from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import { useLongPress } from '../hooks/useLongPress'
import type { DayState } from '../services/scheduleEngine'
import type { Habit } from '../types/index'

interface CalendarDayCellProps {
  date: Date
  habit: Habit
  state: DayState
  hasNote: boolean
  onLongPress: (dateStr: string) => void
}

const CalendarDayCell = memo(({ date, habit, state, hasNote, onLongPress }: CalendarDayCellProps) => {
  const toggleEntry = useHabitStore((s) => s.toggleEntry)
  const dateStr = format(date, 'yyyy-MM-dd')
  const dayNumber = format(date, 'd')
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr

  const { handlers } = useLongPress(() => onLongPress(dateStr))

  const handleTap = () => {
    toggleEntry(habit.id, dateStr)
  }

  // Visual mapping for states
  const getStyles = () => {
    switch (state) {
      case 'target-complete':
        return 'bg-rust border-rust text-cream'
      case 'target-open':
        return isToday ? 'bg-rust/10 border-rust text-ink' : 'bg-transparent border-rust/40 text-ink'
      case 'target-missed':
        return 'bg-transparent border-muted/20 text-muted/60'
      case 'window-empty':
        return 'bg-transparent border-dashed border-muted/10 text-muted/40'
      case 'window-bonus':
        return 'bg-transparent border-dashed border-muted/30 text-ink'
      case 'future':
        return 'bg-transparent border-muted/10 text-muted/30'
      default:
        return ''
    }
  }

  return (
    <button
      {...handlers}
      onClick={handleTap}
      className={`
        relative aspect-square w-full rounded-sm border flex flex-col items-center justify-center transition-all active:scale-95
        ${getStyles()}
        ${isToday ? 'ring-1 ring-offset-1 ring-rust/50' : ''}
      `}
    >
      <span className="absolute top-1 left-1.5 text-[10px] font-mono leading-none opacity-60">
        {dayNumber}
      </span>

      {state === 'target-complete' && (
        <Check size={14} strokeWidth={3} className="text-cream" />
      )}
      
      {state === 'window-bonus' && (
        <Check size={10} strokeWidth={2} className="text-muted/40" />
      )}

      {hasNote && (
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-rust rounded-full" />
      )}
    </button>
  )
})

CalendarDayCell.displayName = 'CalendarDayCell'

export default CalendarDayCell
