import { DeleteHabitModal, EditHabitModal, HeatmapCells, NoteModal } from '@/components'
import { useSwipeReveal } from '@/hooks/useSwipeReveal'
import { useHabitStore } from '@/store/habitStore'
import { useUIStore } from '@/store/uiStore'
import type { Habit } from '@/types'
import { getThemeTokens } from '@/utils/theme'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef, useState } from 'react'
import { ActionDrawer } from './ActionDrawer'
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
  const openSwipeRowId = useUIStore((state) => state.openSwipeRowId)
  const setOpenSwipeRowId = useUIStore((state) => state.setOpenSwipeRowId)

  const isOpen = openSwipeRowId === habit.id

  function handleOpen() {
    setOpenSwipeRowId(habit.id)
  }

  function handleClose() {
    setOpenSwipeRowId(null)
  }

  const isDragActive = useRef(false)
  const {
    translateX,
    isDragging: isSwipeDragging,
    ref: swipeRef,
    handlers,
  } = useSwipeReveal(isOpen, handleOpen, handleClose, !isDragActive.current)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleEditTap() {
    handleClose()
    setTimeout(() => setEditOpen(true), 260)
  }

  function handleDeleteTap() {
    handleClose()
    setTimeout(() => setDeleteOpen(true), 260)
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortDragging,
  } = useSortable({
    id: habit.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.5 : 1,
  }

  const REVEAL_WIDTH = 128

  const hasNote = (dateStr: string) => !!notes[`${habit.id}_${dateStr}`]

  const swipeTrackStyle = {
    transform: `translateX(${translateX}px)`,
    transition: isSwipeDragging ? 'none' : 'transform 0.25s ease',
    touchAction: 'pan-y' as const,
  }

  const isHeatmap = habitsDisplayMode === 'heatmap'

  return (
    <>
      <div ref={setNodeRef} style={style} className="overflow-hidden border-b border-muted-light">
        {isHeatmap ? (
          /* ── Heatmap mode: only the header slides, heatmap stays static ── */
          <div className="flex flex-col">
            {/* Sliding track: header + action drawer */}
            <div className="overflow-hidden">
              <div
                ref={swipeRef}
                {...handlers}
                style={swipeTrackStyle}
                className="flex"
              >
                {/* Header — takes full width */}
                <div
                  className="shrink-0 bg-cream px-4 py-3"
                  style={{ width: '100%', pointerEvents: openSwipeRowId ? 'none' : 'auto' }}
                >
                  <div className="flex items-center gap-2">
                    <HabitRowHeader
                      habit={habit}
                      attributes={attributes}
                      listeners={listeners}
                      tokens={tokens}
                      isOpen={isOpen}
                      isDragActive={isDragActive}
                    />
                  </div>
                </div>

                <ActionDrawer
                  width={REVEAL_WIDTH}
                  onDelete={handleDeleteTap}
                  onEdit={handleEditTap}
                />
              </div>
            </div>

            {/* Heatmap grid — static, NOT inside the swipe track */}
            <div className="bg-cream px-4 pb-4">
              <HeatmapCells entries={entries} colorKey={colorKey} />
            </div>
          </div>
        ) : (
          /* ── Week mode: entire row slides together ── */
          <div
            ref={swipeRef}
            {...handlers}
            style={swipeTrackStyle}
            className="flex"
          >
            {/* Row content — takes full width */}
            <div
              className="shrink-0 bg-cream px-4 py-3"
              style={{ width: '100%', pointerEvents: openSwipeRowId ? 'none' : 'auto' }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <HabitRowHeader
                  habit={habit}
                  attributes={attributes}
                  listeners={listeners}
                  tokens={tokens}
                  isOpen={isOpen}
                  isDragActive={isDragActive}
                />

                <WeekCells
                  habit={habit}
                  entries={entries}
                  hasNote={hasNote}
                  setNoteModalDate={setNoteModalDate}
                  colorKey={colorKey}
                />
              </div>
            </div>

            <ActionDrawer
              width={REVEAL_WIDTH}
              onDelete={handleDeleteTap}
              onEdit={handleEditTap}
            />
          </div>
        )}
      </div>

      {noteModalDate && (
        <NoteModal habitId={habit.id} date={noteModalDate} onClose={() => setNoteModalDate(null)} />
      )}

      {editOpen && <EditHabitModal habit={habit} onClose={() => setEditOpen(false)} />}
      {deleteOpen && <DeleteHabitModal habit={habit} onClose={() => setDeleteOpen(false)} />}
    </>
  )
}
