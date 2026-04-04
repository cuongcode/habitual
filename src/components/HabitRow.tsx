import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { startOfDay, subDays, format } from 'date-fns'
import { GripVertical, Check } from 'lucide-react'
import type { Habit } from '../types/index'
import { useHabitStore } from '../store/habitStore'
import { getDayState } from '../services/scheduleEngine'
import type { DayState } from '../services/scheduleEngine'
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

  let bgColor = 'bg-cream'
  let borderColor = 'border-muted-light'
  let textColor = 'text-muted'
  let borderStyle = 'border'
  let showCheck = false
  let checkColor = 'text-cream'
  let opacity = 'opacity-100'

  switch (state) {
    case 'target-open':
      bgColor = 'bg-cream-dark'
      borderColor = 'border-rust'
      textColor = 'text-ink'
      borderStyle = 'border-[1.5px]'
      break
    case 'target-complete':
      bgColor = 'bg-rust'
      borderColor = 'border-rust'
      textColor = 'text-cream'
      // showCheck = true
      break
    case 'target-missed':
      // bgColor = 'bg-cream-dark'
      // borderColor = 'border-muted-light'
      // textColor = 'text-muted'
      // opacity = 'opacity-60'
      break
    case 'window-empty':
      bgColor = 'bg-rust-light/40'
      borderColor = 'bg-rust-light/40'
      textColor = 'text-rust'
      // borderStyle = 'border'
      break
    case 'window-bonus':
      bgColor = 'bg-rust' // Using tailwind opacity for rust-light
      borderColor = 'border-rust'
      textColor = 'text-cream'
      // textColor = 'text-rust'
      // borderStyle = 'border'
      // showCheck = true
      // checkColor = 'text-rust/60'
      break
    case 'future':
      // bgColor = 'bg-cream'
      // borderColor = 'border-muted-light'
      textColor = 'text-muted-light'
      break
  }

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${bgColor} ${borderColor} ${borderStyle} ${opacity}`}
      >
        {showCheck ? (
          <Check size={10} className={checkColor} strokeWidth={3} />
        ) : (
          <span
            className={textColor}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              lineHeight: 1,
            }}
          >
            {dayNum}
          </span>
        )}
        {/* Note indicator (tiny dot inside) removed per user request */}
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
  const cellDates = Array.from({ length: 7 }, (_, i) => subDays(today, i))

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
