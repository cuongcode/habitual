import { useTranslation } from '@/i18n/useTranslation'
import type { Category, Habit } from '../../types/index'
import { formatSchedule } from '../../utils/format'

interface HabitStatsHeaderProps {
  habit: Habit
  category?: Category
}



export function HabitStatsHeader({ habit, category }: HabitStatsHeaderProps) {
  const { t, lang } = useTranslation()
  const scheduleText = formatSchedule(habit.schedule, t, lang)

  return (
    <div className="bg-cream px-5 pb-4 pt-6">
      <h1 className="font-display text-[20px] leading-tight text-ink">{habit.name}</h1>
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
