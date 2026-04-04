import { memo, useState } from 'react'
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
  const [popping, setPopping] = useState(false)

  const handleTap = () => {
    setPopping(true)
    setTimeout(() => setPopping(false), 180)
    toggleEntry(habit.id, dateStr)
  }

  // Visual mapping for states
  const getStyles = () => {
    switch (state) {
      case 'target-open':
        return 'bg-cream-dark border-[1.5px] border-rust text-ink'
      case 'target-complete':
      case 'window-bonus':
        return 'bg-rust border-rust text-cream'
      case 'target-missed':
        return 'bg-cream border-muted-light text-muted'
      case 'window-empty':
        return 'bg-rust-light/40 border-transparent text-rust'
      case 'future':
        return 'bg-cream border-muted-light text-muted-light'
      default:
        return 'bg-cream border-muted-light text-muted'
    }
  }

  return (
    <button
      {...handlers}
      onClick={handleTap}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className={`
        relative aspect-square w-full rounded-sm border flex flex-col items-center justify-center transition-all active:scale-95
        ${getStyles()}
        ${isToday ? 'ring-1 ring-offset-1 ring-rust/50' : ''}
        ${popping ? 'cell-pop' : ''}
      `}
    >
      <span className="absolute top-1 left-1.5 text-[10px] font-mono leading-none opacity-60">
        {dayNumber}
      </span>

      {(state === 'target-complete' || state === 'window-bonus') && (
        <Check size={14} strokeWidth={3} className="text-cream" />
      )}

      {hasNote && (
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-rust rounded-full" />
      )}
    </button>
  )
})

CalendarDayCell.displayName = 'CalendarDayCell'

export default CalendarDayCell
