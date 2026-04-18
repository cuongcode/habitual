import { differenceInCalendarDays, format } from 'date-fns';

import { getThemeTokens } from '../../utils/theme';
import { SectionLabel } from '../SectionLabel';

interface BestPeriodSectionProps {
  bestPeriod: { start: Date; end: Date } | null
  colorKey?: string
}

export function BestPeriodSection({ bestPeriod, colorKey }: BestPeriodSectionProps) {
  const tokens = getThemeTokens(colorKey)

  if (!bestPeriod) {
    return (
      <div className="space-y-3">
        <SectionLabel>Best period</SectionLabel>
        <div className="bg-surface rounded-xl border border-muted/10 p-4">
          <div className="text-[16px] text-muted font-display">
            No completed streaks yet
          </div>
        </div>
      </div>
    )
  }

  const days = differenceInCalendarDays(bestPeriod.end, bestPeriod.start) + 1

  return (
    <div className="space-y-3">
      <SectionLabel>Best period</SectionLabel>
      <div className="bg-surface rounded-xl border border-muted/10 p-4">
        <div className="text-[16px] text-ink font-serif font-body" >
          {format(bestPeriod.start, 'MMM d, yyyy')} – {format(bestPeriod.end, 'MMM d, yyyy')}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-[32px] ${tokens.text} font-display leading-none`}>
            {days}
          </span>
          <span className="text-[14px] text-muted font-mono">
            days
          </span>
        </div>
      </div>
    </div>
  )
}
