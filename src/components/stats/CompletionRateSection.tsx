import { useState, useEffect } from 'react'

interface CompletionRateSectionProps {
  rate: number
}

export default function CompletionRateSection({ rate }: CompletionRateSectionProps) {
  const [animatedRate, setAnimatedRate] = useState(0)
  
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - animatedRate)

  useEffect(() => {
    // Small delay to ensure the component is mounted before animating
    const timer = setTimeout(() => {
      setAnimatedRate(rate)
    }, 100)
    return () => clearTimeout(timer)
  }, [rate])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[11px] text-muted font-mono uppercase tracking-wider self-start" style={{ fontFamily: 'var(--font-mono)' }}>
        Consistency
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
            className="text-rust transition-all duration-1000 ease-out"
            style={{ transitionProperty: 'stroke-dashoffset' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] text-ink font-display" style={{ fontFamily: 'var(--font-display)' }}>
            {Math.round(rate * 100)}%
          </span>
          <span className="text-[10px] text-muted font-mono uppercase tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>
            completion rate
          </span>
        </div>
      </div>
    </div>
  )
}
