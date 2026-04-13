import { useState, useEffect } from 'react'
import { SectionLabel } from '../SectionLabel'
import { getThemeTokens } from '../../utils/theme'

interface CompletionRateSectionProps {
  rate: number
  colorKey?: string
}

export default function CompletionRateSection({ rate, colorKey }: CompletionRateSectionProps) {
  const [animatedRate, setAnimatedRate] = useState(0)
  const tokens = getThemeTokens(colorKey)
  
  const safeRate = isNaN(rate) ? 0 : rate
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - animatedRate)

  useEffect(() => {
    // Small delay to ensure the component is mounted before animating
    const timer = setTimeout(() => {
      setAnimatedRate(safeRate)
    }, 100)
    return () => clearTimeout(timer)
  }, [rate])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="self-start">
        <SectionLabel>Consistency</SectionLabel>
      </div>
      
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/10"
          />
          {/* Progress Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${tokens.text} transition-all duration-1000 ease-out`}
            style={{ transitionProperty: 'stroke-dashoffset' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {safeRate === 0 ? (
            <span className="text-[16px] text-muted font-mono px-4 text-center">
              No data yet
            </span>
          ) : (
            <>
              <span className="text-[28px] text-ink font-display">
                {Math.round(safeRate * 100)}%
              </span>
              <span className="text-[10px] text-muted font-mono uppercase tracking-tight">
                completion rate
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
