import { DeleteHabitModal, EditHabitModal, HeatmapCells, MonthHeatmapCells, NoteModal } from '@/components'
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
  const colorKey = category?.colorKey || 'muted'
  const tokens = getThemeTokens(colorKey)
  const [noteModalDate, setNoteModalDate] = useState<string | null>(null)
  const habitsDisplayMode = useUIStore((state) => state.habitsDisplayMode)
  const heatmapYear = useUIStore((state) => state.heatmapYear)
  const heatmapMonth = useUIStore((state) => state.heatmapMonth)
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

  const isStacked = habitsDisplayMode === 'year' || habitsDisplayMode === 'month'

  const completedCount = entries.filter((e) => {
    if (!e.completed) return false
    if (habitsDisplayMode === 'year') {
      return e.date.startsWith(String(heatmapYear))
    }
    if (habitsDisplayMode === 'month') {
      const monthStr = String(heatmapMonth).padStart(2, '0')
      return e.date.startsWith(`${heatmapYear}-${monthStr}`)
    }
    return false
  }).length

  return (
    <>
      <div ref={setNodeRef} style={style} className="overflow-hidden border-b border-muted-light">
      {isStacked ? (
          /* ── Stacked mode (year / month): only the header slides, grid stays static ── */
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

                    <span className="shrink-0 font-mono text-[10px] uppercase text-muted">
                      COMPLETED: {completedCount}
                    </span>
                  </div>
                </div>

                <ActionDrawer
                  width={REVEAL_WIDTH}
                  onDelete={handleDeleteTap}
                  onEdit={handleEditTap}
                />
              </div>
            </div>

            {/* Grid — static, NOT inside the swipe track */}
            <div className="flex justify-center bg-cream px-4 pb-4">
              {habitsDisplayMode === 'month' ? (
                <MonthHeatmapCells
                  habit={habit}
                  entries={entries}
                  hasNote={hasNote}
                  setNoteModalDate={setNoteModalDate}
                  colorKey={colorKey}
                />
              ) : (
                <HeatmapCells entries={entries} colorKey={colorKey} />
              )}
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
