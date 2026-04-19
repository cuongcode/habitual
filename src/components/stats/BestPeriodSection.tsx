import { differenceInCalendarDays, format } from 'date-fns'

import { getThemeTokens } from '../../utils/theme'
import { SectionLabel } from '../SectionLabel'

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
        <div className="rounded-xl border border-muted/10 bg-surface p-4">
          <div className="font-display text-[16px] text-muted">No completed streaks yet</div>
        </div>
      </div>
    )
  }

  const days = differenceInCalendarDays(bestPeriod.end, bestPeriod.start) + 1

  return (
    <div className="space-y-3">
      <SectionLabel>Best period</SectionLabel>
      <div className="rounded-xl border border-muted/10 bg-surface p-4">
        <div className="font-body font-serif text-[16px] text-ink">
          {format(bestPeriod.start, 'MMM d, yyyy')} – {format(bestPeriod.end, 'MMM d, yyyy')}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-[32px] ${tokens.text} font-display leading-none`}>{days}</span>
          <span className="font-mono text-[14px] text-muted">days</span>
        </div>
      </div>
    </div>
  )
}
