import { Flame } from 'lucide-react'

import { getThemeTokens } from '../../utils/theme'
import { SectionLabel } from '../SectionLabel'
import { useTranslation } from '@/i18n/useTranslation'

interface StreakSectionProps {
  currentStreak: number
  longestStreak: number
  colorKey?: string
}

export function StreakSection({ currentStreak, longestStreak, colorKey }: StreakSectionProps) {
  const tokens = getThemeTokens(colorKey)
  const { t } = useTranslation()

  return (
    <div className="flex gap-3">
      {/* Current Streak */}
      <div className="flex-1 rounded-xl border border-muted/10 bg-surface p-4">
        <SectionLabel>{t('currentStreak')}</SectionLabel>
        <div className="mt-1 flex items-baseline gap-1">
          <span
            className={`font-display text-[48px] leading-none ${currentStreak > 0 ? 'text-ink' : 'text-muted'}`}
          >
            {isNaN(currentStreak) ? 0 : currentStreak}
          </span>
          {!isNaN(currentStreak) && currentStreak > 0 && (
            <Flame size={16} className={`${tokens.text} fill-current`} />
          )}
        </div>
        <div className="font-mono text-[12px] text-muted">{t('days')}</div>
      </div>

      {/* Longest Streak */}
      <div className="flex-1 rounded-xl border border-muted/10 bg-surface p-4">
        <SectionLabel>{t('longestStreak')}</SectionLabel>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-display text-[48px] leading-none text-ink">
            {isNaN(longestStreak) ? 0 : longestStreak}
          </span>
        </div>
        <div className="font-mono text-[12px] text-muted">{t('days')}</div>
      </div>
    </div>
  )
}
