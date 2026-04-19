const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

interface YearlyPickerProps {
  month?: number
  day?: number
  onMonthChange: (m: number) => void
  onDayChange: (d: number) => void
}

export function YearlyPicker({ month, day, onMonthChange, onDayChange }: YearlyPickerProps) {
  return (
    <div className="flex gap-4">
      {/* Month grid */}
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {MONTH_LABELS.map((label, i) => {
          const m = i + 1
          const isSelected = month === m
          return (
            <button
              key={label}
              type="button"
              onClick={() => onMonthChange(m)}
              className={`flex items-center justify-center rounded-full py-2 font-mono text-label transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Day grid */}
      <div className="grid max-h-[200px] flex-1 grid-cols-4 gap-1 overflow-y-auto scrollbar-hide">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const isSelected = day === d
          return (
            <button
              key={d}
              type="button"
              onClick={() => onDayChange(d)}
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-label transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
