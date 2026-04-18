export function WeekdayHeaders() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return (
    <div className="grid grid-cols-7 px-4 pt-1 pb-2 bg-cream">
      {days.map((day) => (
        <div 
          key={day} 
          className="text-center text-[10px] text-muted font-mono uppercase tracking-widest"
       >
          {day}
        </div>
      ))}
    </div>
  )
}
