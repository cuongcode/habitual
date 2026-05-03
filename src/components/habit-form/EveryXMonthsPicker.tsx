import { MonthDayPicker } from './MonthDayPicker'

interface EveryXMonthsPickerProps {
  interval: number
  day: number
  anchor: string
  onIntervalChange: (interval: number) => void
  onDayChange: (day: number) => void
  onAnchorChange: (anchor: string) => void
}

export function EveryXMonthsPicker({
  interval,
  day,
  anchor,
  onIntervalChange,
  onDayChange,
  onAnchorChange,
}: EveryXMonthsPickerProps) {
  const monthValue = anchor ? anchor.substring(0, 7) : ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Every</span>
        <input
          type="number"
          min="2"
          max="99"
          value={interval}
          onChange={(e) => onIntervalChange(Math.floor(Number(e.target.value)))}
          className="w-[60px] rounded-lg border border-muted-light bg-cream px-3 py-2 font-mono text-[15px] text-ink outline-none transition-colors focus:border-rust"
        />
        <span className="font-body text-body text-ink">months</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Starting in</span>
        <input
          type="month"
          value={monthValue}
          onChange={(e) => {
            if (e.target.value) {
              onAnchorChange(`${e.target.value}-01`)
            }
          }}
          className="rounded-lg border border-muted-light bg-cream px-3 py-2 font-mono text-[15px] text-ink outline-none transition-colors focus:border-rust"
        />
      </div>

      <div className="space-y-2">
        <span className="font-body text-body text-ink">On the</span>
        <MonthDayPicker selected={day} onChange={onDayChange} />
        {day >= 29 && (
          <p className="mt-1 font-mono text-[10px] text-muted">
            Months without this day will be skipped.
          </p>
        )}
      </div>
    </div>
  )
}
