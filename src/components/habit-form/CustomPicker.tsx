interface CustomPickerProps {
  interval?: number
  anchor?: string
  onIntervalChange: (n: number) => void
  onAnchorChange: (d: string) => void
}

export function CustomPicker({
  interval,
  anchor,
  onIntervalChange,
  onAnchorChange,
}: CustomPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Every</span>
        <input
          type="number"
          min={2}
          value={interval ?? 2}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v)) onIntervalChange(Math.max(2, v))
          }}
          className="w-[60px] rounded-md border border-muted-light bg-cream p-2 text-center font-mono text-ink focus:outline-none focus:ring-1 focus:ring-rust"
        />
        <span className="font-body text-body text-ink">days</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Starting from</span>
        <input
          type="date"
          value={anchor ?? ''}
          onChange={(e) => onAnchorChange(e.target.value)}
          className="rounded-md border border-muted-light bg-cream px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-1 focus:ring-rust"
        />
      </div>
    </div>
  )
}
