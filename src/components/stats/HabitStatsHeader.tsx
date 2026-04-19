import { format, setDay } from 'date-fns'

import type { Category, Habit } from '../../types/index'

interface HabitStatsHeaderProps {
  habit: Habit
  category?: Category
}

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const formatSchedule = (habit: Habit) => {
  const { schedule } = habit
  switch (schedule.frequency) {
    case 'daily':
      return 'Every day'
    case 'weekly': {
      const names = schedule.weekdays.map((wd) => format(setDay(new Date(), wd), 'EEEE'))
      if (names.length === 1) return `Every ${names[0]}`
      const last = names[names.length - 1]
      const rest = names.slice(0, -1)
      return `Every ${rest.join(', ')} & ${last}`
    }
    case 'monthly':
      return `Every month on the ${getOrdinal(schedule.dayOfMonth)}`
    case 'yearly': {
      const date = new Date(2000, schedule.month - 1, schedule.dayOfMonth)
      return `Every ${format(date, 'MMMM do')}`
    }
    case 'custom':
      return `Every ${schedule.intervalDays} days`
    default:
      return ''
  }
}

export function HabitStatsHeader({ habit, category }: HabitStatsHeaderProps) {
  const scheduleText = formatSchedule(habit)

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
