import { WeekdayPicker, type Weekday } from './WeekdayPicker'

interface EveryXWeeksPickerProps {
  interval: number
  weekdays: number[]
  anchor: string
  onIntervalChange: (interval: number) => void
  onWeekdaysChange: (weekdays: number[]) => void
  onAnchorChange: (anchor: string) => void
}

export function EveryXWeeksPicker({
  interval,
  weekdays,
  anchor,
  onIntervalChange,
  onWeekdaysChange,
  onAnchorChange,
}: EveryXWeeksPickerProps) {
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
        <span className="font-body text-body text-ink">weeks</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">Starting week of</span>
        <input
          type="date"
          value={anchor}
          onChange={(e) => onAnchorChange(e.target.value)}
          className="rounded-lg border border-muted-light bg-cream px-3 py-2 font-mono text-[15px] text-ink outline-none transition-colors focus:border-rust"
        />
      </div>
      
      <WeekdayPicker selected={weekdays as Weekday[]} onChange={onWeekdaysChange as (wds: Weekday[]) => void} />
    </div>
  )
}
