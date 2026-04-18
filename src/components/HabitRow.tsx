import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format,startOfDay, subDays } from 'date-fns'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLongPress } from '../hooks/useLongPress'
import type { DayState } from '../services/scheduleEngine'
import { getDayState } from '../services/scheduleEngine'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'
import type { Habit } from '../types/index'
import type { HabitEntry } from '../types/index'
import { getDayStateStyles, getThemeTokens } from '../utils/theme'
import { HeatmapCells } from './HeatmapCells'
import { NoteModal } from './NoteModal'

interface HabitRowProps {
  habit: Habit
}

function DayCell({
  state,
  date,
  hasNote,
  colorKey,
}: {
  state: DayState
  date: Date
  hasNote: boolean
  colorKey?: string
}) {
  const dayNum = format(date, 'd')
  const tokens = getThemeTokens(colorKey)

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${getDayStateStyles(state, colorKey)}`}
      >
        <span
         className="font-mono text-2xs leading-none">
          {dayNum}
        </span>
      </div>
      {hasNote && (
        <div className={`absolute -bottom-2 w-[3px] h-[3px] rounded-full ${tokens.dot}`} />
      )}
    </div>
  )
}

export function HabitRow({ habit }: HabitRowProps) {
  const navigate = useNavigate()
  const entries = useHabitStore((state) => state.entries[habit.id]) ?? []
  const notes = useHabitStore((state) => state.notes)
  const categories = useHabitStore((state) => state.categories)
  const category = categories.find((c) => c.id === habit.categoryId)
  const colorKey = category?.colorKey || 'rust'
  const tokens = getThemeTokens(colorKey)
  const [noteModalDate, setNoteModalDate] = useState<string | null>(null)
  const habitsDisplayMode = useUIStore((state) => state.habitsDisplayMode)

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

  const hasNote = (dateStr: string) => !!notes[`${habit.id}_${dateStr}`]

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-cream border-b border-muted-light px-4 ${habitsDisplayMode === 'heatmap' ? 'py-4' : 'py-3'}`}
      >
        {habitsDisplayMode === 'heatmap' ? (
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="shrink-0 text-muted cursor-grab active:cursor-grabbing p-1 touch-none"
                aria-label="Drag to reorder"
              >
                <GripVertical size={16} />
              </div>

              <button
                onClick={() => navigate(`/habit/${habit.id}`)}
                className={`flex-1 truncate text-left text-ink transition-colors ${tokens.textHover} font-body text-body`}
              >
                {habit.name}
              </button>
            </div>
            <HeatmapCells entries={entries} colorKey={colorKey} />
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="shrink-0 text-muted cursor-grab active:cursor-grabbing p-1 touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>

            <button
              onClick={() => navigate(`/habit/${habit.id}`)}
              className={`flex-1 truncate text-left text-ink transition-colors ${tokens.textHover} font-body text-body`}
            >
              {habit.name}
            </button>

            <WeekCells habit={habit} entries={entries} hasNote={hasNote} setNoteModalDate={setNoteModalDate} colorKey={colorKey} />
          </div>
        )}
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
  colorKey,
}: {
  habitId: string
  date: Date
  dateStr: string
  state: DayState
  hasNote: boolean
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
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
      className={`[-webkit-tap-highlight-color:transparent] relative flex-shrink-0 focus:outline-none ${popping ? 'cell-pop' : ''}`}
    >
      <DayCell state={state} date={date} hasNote={hasNote} colorKey={colorKey} />
    </button>
  )
}

function WeekCells({
  habit,
  entries,
  hasNote,
  setNoteModalDate,
  colorKey,
}: {
  habit: Habit
  entries: HabitEntry[]
  hasNote: (dateStr: string) => boolean
  setNoteModalDate: (dateStr: string) => void
  colorKey?: string
}) {
  const today = startOfDay(new Date())
  const cellDates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))

  return (
    <div className="flex gap-1 shrink-0 mode-fade">
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
