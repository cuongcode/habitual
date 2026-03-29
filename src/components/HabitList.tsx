import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useHabitStore } from '../store/habitStore'
import HabitRow from './HabitRow'
import type { Habit } from '../types/index'
import { subDays, format } from 'date-fns'

export default function HabitList() {
  const habits = useHabitStore((s) => s.habits)
  const categories = useHabitStore((s) => s.categories)
  const activeCategoryId = useHabitStore((s) => s.activeCategoryId)
  const reorderHabits = useHabitStore((s) => s.reorderHabits)

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  )

  // Group habits by category
  const groups = useMemo(() => {
    if (activeCategoryId) {
      const filtered = habits
        .filter((h) => h.categoryId === activeCategoryId)
        .sort((a, b) => a.order - b.order)
      const cat = categories.find((c) => c.id === activeCategoryId)
      return cat ? [{ category: cat, habits: filtered }] : []
    }

    // All view: group by category order
    return categories
      .map((cat) => ({
        category: cat,
        habits: habits
          .filter((h) => h.categoryId === cat.id)
          .sort((a, b) => a.order - b.order),
      }))
      .filter((g) => g.habits.length > 0)
  }, [habits, categories, activeCategoryId])

  const activeHabit = activeId ? habits.find((h) => h.id === activeId) : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)

    const { active, over } = event
    if (!over || active.id === over.id) return

    // Find which category group this drag happened in
    const habit = habits.find((h) => h.id === active.id)
    if (!habit) return

    const group = groups.find((g) => g.category.id === habit.categoryId)
    if (!group) return

    const oldIndex = group.habits.findIndex((h) => h.id === active.id)
    const newIndex = group.habits.findIndex((h) => h.id === over.id)

    // If 'over' is in a different category, it won't be found in this group
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(group.habits, oldIndex, newIndex)
    const newOrderedIds = reordered.map((h) => h.id)

    reorderHabits(habit.categoryId, newOrderedIds)
  }

  // Empty state
  if (groups.length === 0) {
    if (activeCategoryId) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 px-8">
          <p className="font-display text-ink text-base text-center m-0">No habits in this category</p>
          <p className="font-mono text-muted text-xs text-center m-0">Add one with the + button</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="16" y="12" width="48" height="58" rx="4" stroke="#9C8E85" strokeWidth="1.5"/>
          <line x1="28" y1="30" x2="52" y2="30" stroke="#C4BAB3" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="28" y1="40" x2="46" y2="40" stroke="#C4BAB3" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="28" y1="50" x2="50" y2="50" stroke="#C4BAB3" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="30" r="2" fill="#C4BAB3"/>
          <circle cx="24" cy="40" r="2" fill="#C4BAB3"/>
          <circle cx="24" cy="50" r="2" fill="#C4BAB3"/>
        </svg>
        <div className="flex flex-col gap-1 mt-2">
          <p className="font-display text-ink text-lg text-center m-0">
            Your notebook is empty
          </p>
          <p className="font-mono text-muted text-xs text-center leading-relaxed m-0">
            Tap the + button below to add your first habit
          </p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.category.id} className="mb-4 last:mb-0">
            {/* Category Header (only show in 'All' view) */}
            {!activeCategoryId && (
              <div className="px-4 py-2 bg-cream-dark/30 border-b border-muted-light/30">
                <span
                  className="text-muted-dark uppercase tracking-wider font-semibold"
                  style={{ fontSize: '11px' }}
                >
                  {group.category.label}
                </span>
              </div>
            )}

            <SortableContext
              items={group.habits.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {group.habits.map((habit) => (
                <HabitRow key={habit.id} habit={habit} />
              ))}
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeHabit ? (
          <DragOverlayRow habit={activeHabit} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// ── Drag overlay (simplified row) ──────────────────────────────────

function DragOverlayRow({ habit }: { habit: Habit }) {
  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(today, i))
  }
  const todayStr = format(today, 'yyyy-MM-dd')

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-cream border-2 border-rust rounded-md shadow-lg"
      style={{ opacity: 0.85 }}
    >
      <span
        className="flex-1 truncate text-ink"
        style={{ fontFamily: "var(--font-body)", fontSize: '15px' }}
      >
        {habit.name}
      </span>
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
