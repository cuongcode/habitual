interface TrashHeaderProps {
  itemCount: number
}

export function TrashHeader({ itemCount }: TrashHeaderProps) {
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
