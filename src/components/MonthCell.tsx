import { format } from 'date-fns'
import { useState } from 'react'

import { useLongPress } from '@/hooks/useLongPress'
import type { DayState } from '@/services/scheduleEngine'
import { useHabitStore } from '@/store/habitStore'
import { getDayStateStyles, getThemeTokens } from '@/utils/theme'

const CELL_SIZE = 28

interface MonthCellProps {
  date: Date
  dateStr: string
  dayState: DayState
  hasNote: boolean
  isToday: boolean
  habitId: string
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
}

export function MonthCell({
  date,
  dateStr,
  dayState,
  hasNote,
  isToday,
  habitId,
  setNoteModalDate,
  colorKey,
}: MonthCellProps) {
  const toggleEntry = useHabitStore((s) => s.toggleEntry)
  const [popping, setPopping] = useState(false)
  const longPress = useLongPress(() => setNoteModalDate(dateStr))
  const tokens = getThemeTokens(colorKey)

  function handleTap() {
    if (longPress.isLongPress.current) return
    setPopping(true)
    setTimeout(() => setPopping(false), 180)
    toggleEntry(habitId, dateStr)
  }

  const dayNum = format(date, 'd')

  return (
    <button
      {...longPress.handlers}
      onClick={handleTap}
      onContextMenu={(e) => {
        e.preventDefault()
        setNoteModalDate(dateStr)
      }}
      className={`relative flex-shrink-0 [-webkit-tap-highlight-color:transparent] focus:outline-none ${popping ? 'cell-pop' : ''}`}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
    >
      <div
        className={`flex items-center justify-center rounded-md transition-colors ${getDayStateStyles(dayState, colorKey)} ${isToday ? tokens.todayBorder : ''}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
      >
        <span className="font-mono text-2xs leading-none">{dayNum}</span>
      </div>

      {/* Note indicator dot — bottom-right */}
      {hasNote && (
        <div
          className={`absolute rounded-full ${dayState === 'target-complete' || dayState === 'window-bonus' ? 'bg-cream' : tokens.dot}`}
          style={{ bottom: 3, right: 3, width: 3, height: 3 }}
        />
      )}
    </button>
  )
}
