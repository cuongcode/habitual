import { differenceInDays, formatDistanceToNow } from 'date-fns'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'

const TRASH_MAX_AGE_DAYS = 30

// ── Header ─────────────────────────────────────────────────────────

function TrashHeader({ itemCount }: { itemCount: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="m-0 font-serif text-[22px] text-ink">Trash</h1>
      {itemCount > 0 && (
        <span className="font-mono text-[11px] text-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      )}
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────

function TrashNav() {
  const navigate = useNavigate()
  return (
    <nav className="pb-safe flex items-center border-t border-muted-light bg-cream px-6 py-3">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 text-ink transition-colors hover:text-rust"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-serif text-[15px]">Settings</span>
      </button>
    </nav>
  )
}

// ── Trash Item Row ─────────────────────────────────────────────────

interface TrashItemRowProps {
  id: string
  habitName: string
  deletedAt: string
  entryCount: number
  noteCount: number
  onRestore: () => void
  onDelete: () => void
}

function TrashItemRow({
  habitName,
  deletedAt,
  entryCount,
  noteCount,
  onRestore,
  onDelete,
}: TrashItemRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const deletedDate = new Date(deletedAt)
  const daysAgo = differenceInDays(new Date(), deletedDate)
  const daysRemaining = Math.max(0, TRASH_MAX_AGE_DAYS - daysAgo)
  const deletedAgoText = formatDistanceToNow(deletedDate, { addSuffix: true })

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Top row: name + metadata */}
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[15px] leading-tight text-ink">{habitName}</span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span>Deleted {deletedAgoText}</span>
          <span>·</span>
          <span>
            {daysRemaining === 0 ? 'Expiring soon' : `${daysRemaining}d left`}
          </span>
        </div>
        <div className="font-mono text-[10px] text-muted opacity-70">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
          {noteCount > 0 && ` · ${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestore}
          className="flex items-center gap-1.5 rounded-full border border-sage/40 px-3 py-1.5 font-mono text-[12px] text-sage transition-all hover:bg-sage hover:text-cream active:scale-95"
        >
          <RotateCcw size={12} />
          Restore
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-full border border-rust/30 px-3 py-1.5 font-mono text-[12px] text-rust/70 transition-all hover:bg-rust hover:text-cream active:scale-95"
          >
            <Trash2 size={12} />
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="rounded-full bg-rust px-3 py-1.5 font-mono text-[12px] text-cream transition-all active:scale-95"
            >
              Delete forever
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────

function TrashEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16">
      <Trash2 size={36} className="text-muted opacity-30" />
      <p className="m-0 text-center font-mono text-[12px] text-muted">
        No deleted habits
      </p>
      <p className="m-0 text-center font-mono text-[11px] text-muted opacity-60">
        Deleted habits are kept here for 30 days
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

export default function TrashPage() {
  const location = useLocation()
  const trashedItems = useHabitStore((s) => s.trashedItems)
  const restoreHabit = useHabitStore((s) => s.restoreHabit)
  const permanentlyDeleteFromTrash = useHabitStore((s) => s.permanentlyDeleteFromTrash)
  const emptyTrash = useHabitStore((s) => s.emptyTrash)
  const showToast = useUIStore((s) => s.showToast)

  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)

  // Sort by most recently deleted first
  const sortedItems = [...trashedItems].sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
  )

  async function handleRestore(id: string, name: string) {
    await restoreHabit(id)
    showToast(`"${name}" restored`)
  }

  async function handleDelete(id: string) {
    await permanentlyDeleteFromTrash(id)
    showToast('Permanently deleted')
  }

  async function handleEmptyTrash() {
    await emptyTrash()
    setShowEmptyConfirm(false)
    showToast('Trash emptied')
  }

  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-cream"
    >
      <header className="sticky top-0 z-10 shrink-0 touch-none border-b border-muted-light bg-cream">
        <TrashHeader itemCount={sortedItems.length} />
      </header>

      <main className="flex flex-1 flex-col overflow-y-auto">
        {sortedItems.length === 0 ? (
          <TrashEmptyState />
        ) : (
          <div className="flex flex-col">
            <div className="overflow-hidden">
              {sortedItems.map((item, idx) => (
                <div key={item.id}>
                  <TrashItemRow
                    id={item.id}
                    habitName={item.habit.name}
                    deletedAt={item.deletedAt}
                    entryCount={item.entries.length}
                    noteCount={item.notes.length}
                    onRestore={() => handleRestore(item.id, item.habit.name)}
                    onDelete={() => handleDelete(item.id)}
                  />
                  {idx < sortedItems.length - 1 && (
                    <div className="mx-4 border-t border-muted-light" />
                  )}
                </div>
              ))}
            </div>

            {/* Empty Trash button */}
            <div className="border-t border-muted-light px-4 py-4">
              {!showEmptyConfirm ? (
                <button
                  onClick={() => setShowEmptyConfirm(true)}
                  className="w-full rounded-full border border-rust/30 py-2.5 text-center font-mono text-[12px] text-rust transition-all hover:bg-rust hover:text-cream active:scale-[0.98]"
                >
                  Empty Trash ({sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'})
                </button>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-body text-sm text-ink">Delete all permanently?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEmptyConfirm(false)}
                      className="px-4 py-2 font-body text-sm text-muted transition-colors hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEmptyTrash}
                      className="rounded-full bg-rust px-4 py-2 font-body text-sm text-cream transition-all active:scale-95"
                    >
                      Empty
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-10 shrink-0 touch-none">
        <TrashNav />
      </footer>
    </div>
  )
}
