import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical, Notebook } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState, HabitRow } from '@/components'
import { useHabitStore } from '@/store/habitStore'
import type { Habit } from '@/types'

export function HabitList() {
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
    const allGroups = categories
      .map((cat) => ({
        category: cat,
        habits: habits.filter((h) => h.categoryId === cat.id).sort((a, b) => a.order - b.order),
      }))
      .filter((g) => g.habits.length > 0)

    const noneHabits = habits
      .filter((h) => !h.categoryId || h.categoryId === 'none')
      .sort((a, b) => a.order - b.order)

    if (noneHabits.length > 0) {
      allGroups.push({
        category: { id: 'none', label: 'None', colorKey: 'muted' },
        habits: noneHabits,
      })
    }

    return allGroups
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
        <EmptyState
          compact
          title="No habits in this category"
          description="Add one with the + button"
        />
      )
    }

    return (
      <EmptyState
        title="Your Habitual is empty"
        description="Tap the + button below to add your first habit"
        icon={<Notebook size={64} strokeWidth={1} />}
      />
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
          <div key={group.category.id} className="mb-0 last:mb-0">
            {/* Category Header (only show in 'All' view) */}
            {/* {!activeCategoryId && group.category.id !== 'none' && (
              <div className="px-4 py-2 bg-cream-dark/30 border-b border-muted-light/30">
                <span
                  className="text-muted-dark uppercase tracking-wider font-semibold text-label"
                >
                  {group.category.label}
                </span>
              </div>
            )} */}

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

      <DragOverlay>{activeHabit ? <DragOverlayRow habit={activeHabit} /> : null}</DragOverlay>
    </DndContext>
  )
}

// ── Drag overlay (simplified row) ──────────────────────────────────

function DragOverlayRow({ habit }: { habit: Habit }) {
  return (
    <div className="flex items-center gap-2 rounded-md border-2 border-rust bg-cream px-4 py-3 opacity-85 shadow-lg">
      <GripVertical size={16} />
      <span className="flex-1 truncate font-body text-body text-ink">{habit.name}</span>
      <div className="flex shrink-0 gap-1"></div>
    </div>
  )
}
