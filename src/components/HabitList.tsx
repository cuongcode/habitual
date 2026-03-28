import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useHabitStore } from '../store/habitStore'
import HabitRow from './HabitRow'
import type { Habit } from '../types/index'

export default function HabitList() {
  const habits = useHabitStore((s) => s.habits)
  const categories = useHabitStore((s) => s.categories)
  const activeCategoryId = useHabitStore((s) => s.activeCategoryId)
  const reorderHabits = useHabitStore((s) => s.reorderHabits)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  // Sort habits: filter by category, then sort by category order → habit order
  let sortedHabits: Habit[]

  if (activeCategoryId) {
    sortedHabits = habits
      .filter((h) => h.categoryId === activeCategoryId)
      .sort((a, b) => a.order - b.order)
  } else {
    // All habits: sort by category order, then habit order
    const catOrderMap = new Map(categories.map((c, i) => [c.id, i]))
    sortedHabits = [...habits].sort((a, b) => {
      const catDiff =
        (catOrderMap.get(a.categoryId) ?? 999) -
        (catOrderMap.get(b.categoryId) ?? 999)
      if (catDiff !== 0) return catDiff
      return a.order - b.order
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeHabit = habits.find((h) => h.id === active.id)
    if (!activeHabit) return

    const categoryId = activeHabit.categoryId
    const categoryHabits = sortedHabits.filter(
      (h) => h.categoryId === categoryId,
    )
    const oldIndex = categoryHabits.findIndex((h) => h.id === active.id)
    const newIndex = categoryHabits.findIndex((h) => h.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(categoryHabits, oldIndex, newIndex)
    reorderHabits(
      categoryId,
      reordered.map((h) => h.id),
    )
  }

  // Empty state
  if (sortedHabits.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          className="text-muted-light"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Page */}
          <rect x="16" y="8" width="32" height="48" rx="3" />
          {/* Lines on page */}
          <line x1="24" y1="20" x2="40" y2="20" />
          <line x1="24" y1="28" x2="36" y2="28" />
          {/* Pen */}
          <line x1="44" y1="40" x2="52" y2="56" />
        </svg>
        <p
          className="text-muted text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: '16px',
          }}
        >
          No habits yet
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedHabits.map((h) => h.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto">
          {sortedHabits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
