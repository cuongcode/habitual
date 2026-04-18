import { startOfWeek, addDays, subWeeks, format } from 'date-fns'
import { getDayState } from '../../services/scheduleEngine'
import { SectionLabel } from '../SectionLabel'
import type { Habit, HabitEntry } from '../../types/index'
import { getThemeTokens } from '../../utils/theme'

interface HeatmapSectionProps {
  habit: Habit
  entries: HabitEntry[]
  colorKey?: string
}

export function HeatmapSection({ habit, entries, colorKey }: HeatmapSectionProps) {
  const tokens = getThemeTokens(colorKey)
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
        return tokens.heatmapFilled
      case 'window-bonus':
        return `${tokens.heatmapFilled} opacity-60`
      case 'target-missed':
        return 'bg-muted-light' // muted-light
      case 'window-empty':
      case 'future':
        return 'bg-surface' // cream-dark
      case 'target-open':
        return `border ${tokens.todayBorder.replace('border-2 ', '')} bg-cream`
      default:
        return 'bg-surface'
    }
  }

  return (
    <div className="space-y-3">
      <SectionLabel>Last 52 weeks</SectionLabel>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-fit">
          {/* Month labels */}
          <div className="relative h-4 mb-1">
            {monthLabels.map((m, i) => (
              <div 
                key={i} 
                className="absolute text-[9px] text-muted font-mono uppercase"
                style={{ left: `${m.index * 12}px`, }}
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
