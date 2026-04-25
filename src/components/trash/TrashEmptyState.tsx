import { Trash2 } from 'lucide-react'

export function TrashEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 animate-in fade-in zoom-in-95 duration-500">
      <div className="rounded-full bg-muted/5 p-6 text-muted opacity-30">
        <Trash2 size={48} strokeWidth={1.5} />
      </div>
      <p className="m-0 text-center font-serif text-[18px] text-ink">
        Your trash is empty
      </p>
      <p className="max-w-[200px] m-0 text-center font-mono text-[11px] leading-relaxed text-muted opacity-60">
        Habits you delete will appear here for 30 days before being permanently removed.
      </p>
    </div>
  )
}
