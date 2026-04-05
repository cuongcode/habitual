import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { startOfDay, subDays, format } from 'date-fns'
import { GripVertical } from 'lucide-react'
import type { Habit } from '../types/index'
import { useHabitStore } from '../store/habitStore'
import { getDayState } from '../services/scheduleEngine'
import type { DayState } from '../services/scheduleEngine'
import { getDayStateStyles } from '../utils/theme'
import { useLongPress } from '../hooks/useLongPress'
import NoteModal from './NoteModal'

interface HabitRowProps {
  habit: Habit
}

function DayCell({
  state,
  date,
  hasNote,
}: {
  state: DayState
  date: Date
  hasNote: boolean
}) {
  const dayNum = format(date, 'd')

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${getDayStateStyles(state)}`}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            lineHeight: 1,
          }}
        >
          {dayNum}
        </span>
      </div>
      {hasNote && (
        <div className="absolute -bottom-2 w-[3px] h-[3px] rounded-full bg-rust" />
      )}
    </div>
  )
}

export default function HabitRow({ habit }: HabitRowProps) {
  const navigate = useNavigate()
  const entries = useHabitStore((state) => state.entries[habit.id]) ?? []
  const notes = useHabitStore((state) => state.notes)
  const [noteModalDate, setNoteModalDate] = useState<string | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const today = startOfDay(new Date())
  const cellDates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))

  const hasNote = (dateStr: string) => !!notes[`${habit.id}_${dateStr}`]

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 px-4 py-3 border-b border-muted-light bg-cream"
      >
        <div
          {...attributes}
          {...listeners}
          className="shrink-0 text-muted cursor-grab active:cursor-grabbing p-1"
          style={{ touchAction: 'none' }}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        <button
          onClick={() => navigate(`/habit/${habit.id}`)}
          className="flex-1 truncate text-left text-ink hover:text-rust transition-colors"
          style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}
        >
          {habit.name}
        </button>

        <div className="flex gap-1 shrink-0">
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
              />
            )
          })}
        </div>
      </div>

      {noteModalDate && (
        <NoteModal
          habitId={habit.id}
          date={noteModalDate}
          onClose={() => setNoteModalDate(null)}
        />
      )}
    </>
  )
}

function InteractiveDayCell({
  habitId,
  date,
  dateStr,
  state,
  hasNote,
  setNoteModalDate,
}: {
  habitId: string
  date: Date
  dateStr: string
  state: DayState
  hasNote: boolean
  setNoteModalDate: (dateStr: string) => void
}) {
  const store = useHabitStore()
  const longPress = useLongPress(() => setNoteModalDate(dateStr))
  const [popping, setPopping] = useState(false)

  const handleTap = () => {
    if (longPress.isLongPress.current) return
    setPopping(true)
    setTimeout(() => setPopping(false), 180)
    store.toggleEntry(habitId, dateStr)
  }

  return (
    <button
      {...longPress.handlers}
      onClick={handleTap}
      onContextMenu={(e) => {
        e.preventDefault()
        setNoteModalDate(dateStr)
      }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className={`relative flex-shrink-0 focus:outline-none ${popping ? 'cell-pop' : ''}`}
    >
      <DayCell state={state} date={date} hasNote={hasNote} />
    </button>
  )
}
