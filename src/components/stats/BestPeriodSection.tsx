import { format, differenceInCalendarDays } from 'date-fns'
import { SectionLabel } from '../SectionLabel'

interface BestPeriodSectionProps {
  bestPeriod: { start: Date; end: Date } | null
}

export default function BestPeriodSection({ bestPeriod }: BestPeriodSectionProps) {
  if (!bestPeriod) {
    return (
      <div className="space-y-3">
        <SectionLabel>Best period</SectionLabel>
        <div className="bg-[#F2EFE9] rounded-xl border border-muted/10 p-4">
          <div className="text-[16px] text-muted font-display" style={{ fontFamily: 'var(--font-display)' }}>
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
      <div className="bg-[#F2EFE9] rounded-xl border border-muted/10 p-4">
        <div className="text-[16px] text-ink font-serif" style={{ fontFamily: 'var(--font-serif), Lora, serif' }}>
          {format(bestPeriod.start, 'MMM d, yyyy')} – {format(bestPeriod.end, 'MMM d, yyyy')}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[32px] text-rust font-display leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {days}
          </span>
          <span className="text-[14px] text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
            days
          </span>
        </div>
      </div>
    </div>
  )
}
