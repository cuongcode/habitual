import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface HabitStatsNavProps {
  habitId: string
}

export default function HabitStatsNav({ habitId }: HabitStatsNavProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-sm border-t border-muted/10 z-20 pb-safe"
    >
      <div className="flex justify-between items-center px-6 py-4">
        <Link 
          to={`/habit/${habitId}`} 
          className="flex items-center gap-1.5 text-[12px] text-ink font-mono uppercase tracking-wider"
       >
          <ArrowLeft size={16} />
          <span>Calendar</span>
        </Link>
      </div>
    </nav>
  )
}
