interface MonthDayPickerProps {
  selected?: number
  onChange: (d: number) => void
}

export function MonthDayPicker({ selected, onChange }: MonthDayPickerProps) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const isSelected = selected === d
        return (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-colors ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'}`}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}
