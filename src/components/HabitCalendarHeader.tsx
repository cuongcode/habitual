import { SlidersHorizontal } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'
import type { Category, Habit } from '../types/index'
import { formatSchedule } from '../utils/format'

interface HabitCalendarHeaderProps {
  habit: Habit
  category?: Category
  onEditPress?: () => void
}



export function HabitCalendarHeader({ habit, category, onEditPress }: HabitCalendarHeaderProps) {
  const { t } = useTranslation()
  const scheduleText = formatSchedule(habit.schedule, t)

  return (
    <div className="bg-cream px-5 pb-4 pt-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="min-w-0 truncate font-display text-[20px] leading-tight text-ink">
          {habit.name}
        </h1>
        <button
          className="shrink-0 p-1 text-muted transition-colors hover:text-ink"
          onClick={onEditPress}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
      <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span>{scheduleText}</span>
        {category && (
          <>
            <span className="opacity-40">·</span>
            <span>{category.label}</span>
          </>
        )}
      </div>
    </div>
  )
}
