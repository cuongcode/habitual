import { ArrowLeft, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HabitCalendarNavProps {
  habitId: string
}

export function HabitCalendarNav({ habitId }: HabitCalendarNavProps) {
  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-20 border-t border-muted/10 bg-cream/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ink"
        >
          <ArrowLeft size={16} />
          <span>Habits</span>
        </Link>
        <Link
          to={`/habit/${habitId}/stats`}
          className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ink"
        >
          <BarChart2 size={16} />
          <span>Stats</span>
        </Link>
      </div>
    </nav>
  )
}
