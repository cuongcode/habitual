import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { memo, useState } from 'react'

import { useLongPress } from '../hooks/useLongPress'
import type { DayState } from '../services/scheduleEngine'
import { useHabitStore } from '../store/habitStore'
import type { Habit } from '../types/index'
import { getDayStateStyles, getThemeTokens } from '../utils/theme'

interface CalendarDayCellProps {
  date: Date
  habit: Habit
  state: DayState
  hasNote: boolean
  onLongPress: (dateStr: string) => void
  colorKey?: string
}

export const CalendarDayCell = memo(
  ({ date, habit, state, hasNote, onLongPress, colorKey }: CalendarDayCellProps) => {
    const toggleEntry = useHabitStore((s) => s.toggleEntry)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayNumber = format(date, 'd')
    const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr
    const tokens = getThemeTokens(colorKey)

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
        className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-sm transition-all [-webkit-tap-highlight-color:transparent] active:scale-95 ${getDayStateStyles(state, colorKey)} ${isToday ? tokens.todayBorder : ''} ${popping ? 'cell-pop' : ''} `}
      >
        <span className="absolute left-1.5 top-1 font-mono text-[10px] leading-none opacity-60">
          {dayNumber}
        </span>

        {(state === 'target-complete' || state === 'window-bonus') && (
          <Check size={14} strokeWidth={3} className="text-cream" />
        )}

        {hasNote && (
          <div
            className={`absolute bottom-1 right-1 h-1 w-1 rounded-full ${state === 'target-complete' || state === 'window-bonus' ? 'bg-cream' : tokens.dot}`}
          />
        )}
      </button>
    )
  },
)

CalendarDayCell.displayName = 'CalendarDayCell'
