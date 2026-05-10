import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'

interface HabitStatsNavProps {
  habitId: string
}

export function HabitStatsNav({ habitId }: HabitStatsNavProps) {
  const { t } = useTranslation()
  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-20 border-t border-muted/10 bg-cream/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to={`/habit/${habitId}`}
          className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ink"
        >
          <ArrowLeft size={16} />
          <span>{t('calendar')}</span>
        </Link>
      </div>
    </nav>
  )
}
