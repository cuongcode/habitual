import { format, setDay } from 'date-fns'
import type { Habit, Category } from '../../types/index'

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
      const names = schedule.weekdays.map(wd => format(setDay(new Date(), wd), 'EEEE'))
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

export default function HabitStatsHeader({ habit, category }: HabitStatsHeaderProps) {
  const scheduleText = formatSchedule(habit)
  
  return (
    <div className="px-5 pt-6 pb-4 bg-cream">
      <h1 className="text-[20px] text-ink font-display leading-tight">
        {habit.name}
      </h1>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted font-mono uppercase tracking-wider">
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
