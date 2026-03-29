import { Flame } from 'lucide-react'

interface StreakSectionProps {
  currentStreak: number
  longestStreak: number
}

export default function StreakSection({ currentStreak, longestStreak }: StreakSectionProps) {
  return (
    <div className="flex gap-3">
      {/* Current Streak */}
      <div className="bg-[#F2EFE9] rounded-xl border border-muted/10 p-4 flex-1">
        <div className="text-[11px] text-muted font-mono uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
          Current streak
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span 
            className={`text-[48px] font-display leading-none ${currentStreak > 0 ? 'text-ink' : 'text-muted'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {currentStreak}
          </span>
          {currentStreak > 0 && <Flame size={16} className="text-rust fill-rust" />}
        </div>
        <div className="text-[12px] text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
          days
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-[#F2EFE9] rounded-xl border border-muted/10 p-4 flex-1">
        <div className="text-[11px] text-muted font-mono uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
          Longest streak
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span 
            className="text-[48px] text-ink font-display leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {longestStreak}
          </span>
        </div>
        <div className="text-[12px] text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
          days
        </div>
      </div>
    </div>
  )
}
