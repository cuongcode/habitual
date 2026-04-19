export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface WeekdayPickerProps {
  selected: Weekday[]
  onChange: (wds: Weekday[]) => void
}

export function WeekdayPicker({ selected, onChange }: WeekdayPickerProps) {
  // Display Mon–Sun; map display index → JS weekday (0=Sun)
  const displayToJS: Weekday[] = [1, 2, 3, 4, 5, 6, 0]
  const atMax = selected.length >= 6

  function toggle(jsDay: Weekday) {
    if (selected.includes(jsDay)) {
      // Never deselect the last one
      if (selected.length === 1) return
      onChange(selected.filter((d) => d !== jsDay))
    } else {
      // Cap at 6
      if (atMax) return
      onChange([...selected, jsDay])
    }
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        {WEEKDAY_LABELS.map((label, i) => {
          const jsDay = displayToJS[i]
          const isSelected = selected.includes(jsDay)
          const isDisabled = atMax && !isSelected
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(jsDay)}
              className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-all active:scale-90 ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'} ${isDisabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'}`}
            >
              {label}
            </button>
          )
        })}
      </div>
      {atMax && (
        <p className="mt-2 text-center font-mono text-label text-muted">Maximum 6 days selected</p>
      )}
    </div>
  )
}
