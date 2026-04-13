import { Flame } from 'lucide-react'
import { SectionLabel } from '../SectionLabel'
import { getThemeTokens } from '../../utils/theme'

interface StreakSectionProps {
  currentStreak: number
  longestStreak: number
  colorKey?: string
}

export default function StreakSection({ currentStreak, longestStreak, colorKey }: StreakSectionProps) {
  const tokens = getThemeTokens(colorKey)

  return (
    <div className="flex gap-3">
      {/* Current Streak */}
      <div className="bg-surface rounded-xl border border-muted/10 p-4 flex-1">
        <SectionLabel>Current streak</SectionLabel>
        <div className="flex items-baseline gap-1 mt-1">
          <span 
            className={`text-[48px] font-display leading-none ${currentStreak > 0 ? 'text-ink' : 'text-muted'}`}
          >
            {isNaN(currentStreak) ? 0 : currentStreak}
          </span>
          {(!isNaN(currentStreak) && currentStreak > 0) && <Flame size={16} className={`${tokens.text} fill-current`} />}
        </div>
        <div className="text-[12px] text-muted font-mono">
          days
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-surface rounded-xl border border-muted/10 p-4 flex-1">
        <SectionLabel>Longest streak</SectionLabel>
        <div className="flex items-baseline gap-1 mt-1">
          <span 
            className="text-[48px] text-ink font-display leading-none"
         >
            {isNaN(longestStreak) ? 0 : longestStreak}
          </span>
        </div>
        <div className="text-[12px] text-muted font-mono">
          days
        </div>
      </div>
    </div>
  )
}
