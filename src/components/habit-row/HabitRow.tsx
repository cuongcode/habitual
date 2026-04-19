import { HeatmapCells, NoteModal } from '@/components'
import { useHabitStore } from '@/store/habitStore'
import { useUIStore } from '@/store/uiStore'
import type { Habit } from '@/types'
import { getThemeTokens } from '@/utils/theme'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { HabitRowHeader } from './HabitRowHeader'
import { WeekCells } from './WeekCells'

interface HabitRowProps {
  habit: Habit
}

export function HabitRow({ habit }: HabitRowProps) {
  const entries = useHabitStore((state) => state.entries[habit.id]) ?? []
  const notes = useHabitStore((state) => state.notes)
  const categories = useHabitStore((state) => state.categories)
  const category = categories.find((c) => c.id === habit.categoryId)
  const colorKey = category?.colorKey || 'rust'
  const tokens = getThemeTokens(colorKey)
  const [noteModalDate, setNoteModalDate] = useState<string | null>(null)
  const habitsDisplayMode = useUIStore((state) => state.habitsDisplayMode)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
  })

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
        className={`border-b border-muted-light bg-cream px-4 ${habitsDisplayMode === 'heatmap' ? 'py-4' : 'py-3'}`}
      >
        {habitsDisplayMode === 'heatmap' ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <HabitRowHeader
                habit={habit}
                attributes={attributes}
                listeners={listeners}
                tokens={tokens}
              />
            </div>
            <HeatmapCells entries={entries} colorKey={colorKey} />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <HabitRowHeader
              habit={habit}
              attributes={attributes}
              listeners={listeners}
              tokens={tokens}
            />

            <WeekCells
              habit={habit}
              entries={entries}
              hasNote={hasNote}
              setNoteModalDate={setNoteModalDate}
              colorKey={colorKey}
            />
          </div>
        )}
      </div>

      {noteModalDate && (
        <NoteModal habitId={habit.id} date={noteModalDate} onClose={() => setNoteModalDate(null)} />
      )}
    </>
  )
}
