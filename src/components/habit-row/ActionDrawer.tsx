import { Pencil, Trash2 } from 'lucide-react'

interface ActionDrawerProps {
  width: number
  onDelete: () => void
  onEdit: () => void
}

export function ActionDrawer({ width, onDelete, onEdit }: ActionDrawerProps) {
  return (
    <div
      data-swipe-action
      className="flex shrink-0"
      style={{ width }}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="flex flex-1 flex-col items-center justify-center gap-1 bg-red-700 active:opacity-80"
      >
        <Trash2 size={18} className="text-cream" />
        <span className="font-mono text-cream" style={{ fontSize: 10 }}>
          Delete
        </span>
      </button>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="flex flex-1 flex-col items-center justify-center gap-1 active:opacity-80"
      >
        <Pencil size={18} className="" />
        <span className="font-mono" style={{ fontSize: 10 }}>
          Edit
        </span>
      </button>
    </div>
  )
}
