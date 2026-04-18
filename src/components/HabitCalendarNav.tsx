import { ArrowLeft, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HabitCalendarNavProps {
  habitId: string
}

export function HabitCalendarNav({ habitId }: HabitCalendarNavProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-sm border-t border-muted/10 z-20 pb-safe"
    >
      <div className="flex justify-between items-center px-6 py-4">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-[12px] text-ink font-mono uppercase tracking-wider"
       >
          <ArrowLeft size={16} />
          <span>Habits</span>
        </Link>
        <Link 
          to={`/habit/${habitId}/stats`} 
          className="flex items-center gap-1.5 text-[12px] text-ink font-mono uppercase tracking-wider"
       >
          <BarChart2 size={16} />
          <span>Stats</span>
        </Link>
      </div>
    </nav>
  )
}
