import { useState } from 'react'
import { useLongPress } from '@/hooks/useLongPress'
import type { DayState } from '@/services/scheduleEngine'
import { useHabitStore } from '@/store/habitStore'
import { DayCell } from './DayCell'

interface InteractiveDayCellProps {
  habitId: string
  date: Date
  dateStr: string
  state: DayState
  hasNote: boolean
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
}

export function InteractiveDayCell({
  habitId,
  date,
  dateStr,
  state,
  hasNote,
  setNoteModalDate,
  colorKey,
}: InteractiveDayCellProps) {
  const store = useHabitStore()
  const longPress = useLongPress(() => setNoteModalDate(dateStr))
  const [popping, setPopping] = useState(false)

  const isFuture = state === 'future'
  const handleTap = () => {
    if (isFuture || longPress.isLongPress.current) return
    setPopping(true)
    setTimeout(() => setPopping(false), 180)
    store.toggleEntry(habitId, dateStr)
  }

  return (
    <button
      {...longPress.handlers}
      onClick={handleTap}
      disabled={isFuture}
      onContextMenu={(e) => {
        e.preventDefault()
        if (!isFuture) setNoteModalDate(dateStr)
      }}
      className={`relative flex-shrink-0 [-webkit-tap-highlight-color:transparent] focus:outline-none ${isFuture ? 'pointer-events-none cursor-default' : ''} ${popping ? 'cell-pop' : ''}`}
    >
      <DayCell state={state} date={date} hasNote={hasNote} colorKey={colorKey} />
    </button>
  )
}
