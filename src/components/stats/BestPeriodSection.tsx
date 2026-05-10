import { differenceInCalendarDays } from 'date-fns'

import { useTranslation } from '@/i18n/useTranslation'
import { getThemeTokens } from '../../utils/theme'
import { SectionLabel } from '../SectionLabel'

interface BestPeriodSectionProps {
  bestPeriod: { start: Date; end: Date } | null
  colorKey?: string
}

export function BestPeriodSection({ bestPeriod, colorKey }: BestPeriodSectionProps) {
  const tokens = getThemeTokens(colorKey)
  const { t, lang } = useTranslation()
  const formatter = new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (!bestPeriod) {
    return (
      <div className="space-y-3">
        <SectionLabel>{t('bestPeriod')}</SectionLabel>
        <div className="rounded-xl border border-muted/10 bg-surface p-4">
          <div className="font-display text-[16px] text-muted">{t('noBestPeriod')}</div>
        </div>
      </div>
    )
  }

  const days = differenceInCalendarDays(bestPeriod.end, bestPeriod.start) + 1

  return (
    <div className="space-y-3">
      <SectionLabel>{t('bestPeriod')}</SectionLabel>
      <div className="rounded-xl border border-muted/10 bg-surface p-4">
        <div className="font-serif text-[16px] text-ink">
          {formatter.format(bestPeriod.start)} – {formatter.format(bestPeriod.end)}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-[32px] ${tokens.text} font-display leading-none`}>{days}</span>
          <span className="font-mono text-[14px] text-muted">{t('days')}</span>
        </div>
      </div>
    </div>
  )
}
