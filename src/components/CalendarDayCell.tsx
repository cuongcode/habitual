import { memo, useState } from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import { useLongPress } from '../hooks/useLongPress'
import type { DayState } from '../services/scheduleEngine'
import { getDayStateStyles } from '../utils/theme'
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

  return (
    <button
      {...handlers}
      onClick={handleTap}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className={`
        relative aspect-square w-full rounded-sm flex flex-col items-center justify-center transition-all active:scale-95
        ${getDayStateStyles(state)}
        ${isToday ? 'border-2 border-rust' : ''}
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
        <div className={`absolute bottom-1 right-1 w-1 h-1 rounded-full ${(state === 'target-complete' || state === 'window-bonus') ? 'bg-cream' : 'bg-rust'}`} />
      )}
    </button>
  )
})

CalendarDayCell.displayName = 'CalendarDayCell'

export default CalendarDayCell
