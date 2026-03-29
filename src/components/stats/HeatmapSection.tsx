import { startOfWeek, addDays, subWeeks, format, isAfter, isSameMonth, startOfMonth } from 'date-fns'
import { getDayState } from '../../services/scheduleEngine'
import type { Habit, HabitEntry } from '../../types/index'

interface HeatmapSectionProps {
  habit: Habit
  entries: HabitEntry[]
}

export default function HeatmapSection({ habit, entries }: HeatmapSectionProps) {
  // 52 weeks ago, starting from Monday
  const gridStart = startOfWeek(subWeeks(new Date(), 52), { weekStartsOn: 1 })
  const allDates = Array.from({ length: 364 }, (_, i) => addDays(gridStart, i))

  // Group dates into weeks (columns)
  const columns = []
  for (let i = 0; i < 52; i++) {
    columns.push(allDates.slice(i * 7, (i + 1) * 7))
  }

  // Month labels
  const monthLabels = []
  let lastMonth = -1
  for (let i = 0; i < 52; i++) {
    const firstDayOfWeek = columns[i][0]
    const currentMonth = firstDayOfWeek.getMonth()
    if (currentMonth !== lastMonth) {
      monthLabels.push({
        label: format(firstDayOfWeek, 'MMM'),
        index: i,
      })
      lastMonth = currentMonth
    }
  }

  const getCellStyles = (date: Date) => {
    const state = getDayState(date, habit, entries)
    
    switch (state) {
      case 'target-complete':
        return 'bg-rust'
      case 'window-bonus':
        return 'bg-rust/40'
      case 'target-missed':
        return 'bg-[#D1CDC7]' // muted-light
      case 'window-empty':
      case 'future':
        return 'bg-[#F2EFE9]' // cream-dark
      case 'target-open':
        return 'border border-rust bg-[#FAF9F6]' // cream fill (approx)
      default:
        return 'bg-[#F2EFE9]'
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-[11px] text-muted font-mono uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
        Last 52 weeks
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-fit">
          {/* Month labels */}
          <div className="relative h-4 mb-1">
            {monthLabels.map((m, i) => (
              <div 
                key={i} 
                className="absolute text-[9px] text-muted font-mono uppercase"
                style={{ left: `${m.index * 12}px`, fontFamily: 'var(--font-mono)' }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div 
            className="grid grid-flow-col gap-[2px]"
            style={{ 
              gridTemplateColumns: 'repeat(52, 10px)', 
              gridTemplateRows: 'repeat(7, 10px)' 
            }}
          >
            {allDates.map((date, i) => (
              <div
                key={i}
                className={`w-[10px] h-[10px] rounded-[1px] ${getCellStyles(date)}`}
                title={format(date, 'MMM d, yyyy')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
