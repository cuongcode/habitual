export function WeekdayHeaders() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="grid grid-cols-7 bg-cream px-4 pb-2 pt-1">
      {days.map((day) => (
        <div
          key={day}
          className="text-center font-mono text-[10px] uppercase tracking-widest text-muted"
        >
          {day}
        </div>
      ))}
    </div>
  )
}
