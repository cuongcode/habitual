import { format } from 'date-fns'
import type { DayState } from '@/services/scheduleEngine'
import { getDayStateStyles, getThemeTokens } from '@/utils/theme'

interface DayCellProps {
  state: DayState
  date: Date
  hasNote: boolean
  colorKey?: string
}

export function DayCell({
  state,
  date,
  hasNote,
  colorKey,
}: DayCellProps) {
  const dayNum = format(date, 'd')
  const tokens = getThemeTokens(colorKey)

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${getDayStateStyles(state, colorKey)}`}
      >
        <span className="font-mono text-2xs leading-none">{dayNum}</span>
      </div>
      {hasNote && (
        <div className={`absolute -bottom-2 h-[3px] w-[3px] rounded-full ${tokens.dot}`} />
      )}
    </div>
  )
}
