import { differenceInDays, formatDistanceToNow } from 'date-fns'
import { RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'

const TRASH_MAX_AGE_DAYS = 30

interface TrashItemRowProps {
  habitName: string
  deletedAt: string
  entryCount: number
  noteCount: number
  onRestore: () => void
  onDelete: () => void
}

export function TrashItemRow({
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
    <div className="group relative flex flex-col gap-3 p-4 transition-colors hover:bg-cream-dark/30">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[16px] leading-tight text-ink">{habitName}</span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span>Deleted {deletedAgoText}</span>
          <span className="opacity-40">·</span>
          <span className={daysRemaining <= 3 ? 'text-rust font-medium' : ''}>
            {daysRemaining === 0 ? 'Expiring soon' : `${daysRemaining}d left`}
          </span>
        </div>
        <div className="font-mono text-[10px] text-muted opacity-60">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
          {noteCount > 0 && ` · ${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRestore}
          className="flex items-center gap-1.5 rounded-full border border-sage/30 bg-cream/50 px-3 py-1.5 font-mono text-[12px] text-sage transition-all hover:border-sage hover:bg-sage hover:text-cream active:scale-95"
        >
          <RotateCcw size={12} />
          Restore
        </button>

        {!showDeleteConfirm ? (
          <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 rounded-full border border-rust/20 bg-cream/50 px-3 py-1.5 font-mono text-[12px] text-rust/60 transition-all hover:border-rust/40 hover:bg-rust/5 hover:text-rust active:scale-95"
          >
            <Trash2 size={12} />
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="rounded-full bg-rust px-4 py-1.5 font-mono text-[12px] text-cream shadow-sm transition-all hover:bg-rust-dark hover:shadow-md active:scale-95"
            >
              Delete forever
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
