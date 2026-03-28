import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { subDays, format } from 'date-fns'
import type { Habit } from '../types/index'

interface HabitRowProps {
  habit: Habit
}

export default function HabitRow({ habit }: HabitRowProps) {
  const navigate = useNavigate()
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

  // Build 7-day range: today + 6 previous days
  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(today, i))
  }

  const todayStr = format(today, 'yyyy-MM-dd')

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 px-4 py-3 border-b border-muted-light bg-cream"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="w-5 shrink-0 text-muted cursor-grab active:cursor-grabbing select-none"
        style={{ fontSize: '16px', lineHeight: 1 }}
        aria-label="Drag to reorder"
      >
        ≡
      </button>

      {/* Habit name */}
      <button
        onClick={() => navigate(`/habit/${habit.id}`)}
        className="flex-1 truncate text-left text-ink hover:text-rust transition-colors"
        style={{ fontFamily: "var(--font-body)", fontSize: '15px' }}
      >
        {habit.name}
      </button>

      {/* Day cells */}
      <div className="flex gap-1 shrink-0">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayNum = format(day, 'd')
          const isToday = dateStr === todayStr

          return (
            <div
              key={dateStr}
              className={`w-7 h-7 rounded-md flex items-center justify-center bg-cream-dark
                ${isToday ? 'border-2 border-rust' : 'border border-muted-light'}`}
            >
              <span
                className="text-muted"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: '10px',
                  lineHeight: 1,
                }}
              >
                {dayNum}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
