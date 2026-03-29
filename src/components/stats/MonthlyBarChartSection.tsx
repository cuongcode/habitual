import type { MonthlyRate } from '../../services/statsEngine'
import { SectionLabel } from '../SectionLabel'

interface MonthlyBarChartSectionProps {
  monthlyRates: MonthlyRate[]
}

// Seeded pseudo-random per month so jitter is stable across renders
function seededJitter(seed: number): number {
  const x = Math.sin(seed) * 10000
  return (x - Math.floor(x) - 0.5) * 3 // ±1.5px jitter
}

export default function MonthlyBarChartSection({ monthlyRates }: MonthlyBarChartSectionProps) {
  // Show last 6 months, oldest left, newest right
  const data = [...monthlyRates].reverse()
  const maxBarHeight = 80
  const baseline = 95
  const barWidth = 28
  const barGap = 16

  const getBarColor = (rate: number) => {
    if (rate >= 0.7) return '#A85743' // rust
    if (rate >= 0.4) return '#D99B8C' // rust-light
    return '#D1CDC7' // muted-light
  }

  return (
    <div className="space-y-3">
      <SectionLabel>Monthly consistency</SectionLabel>
      
      <div className="w-full h-[110px]">
        <svg viewBox="0 0 280 110" width="100%" className="overflow-visible">
          {data.map((m, i) => {
            const barHeight = m.rate * maxBarHeight
            const x = i * (barWidth + barGap) + 10
            const jitter = seededJitter(m.month)
            const y = baseline - barHeight + jitter
            
            return (
              <g key={i}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 0)}
                  fill={getBarColor(m.rate)}
                  rx="3"
                  className="transition-all duration-700 ease-out"
                />
                
                {/* Percentage label */}
                {barHeight > 16 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    className="text-[9px] fill-muted font-mono"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '9px' }}
                  >
                    {Math.round(m.rate * 100)}%
                  </text>
                )}
                
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={baseline + 12}
                  textAnchor="middle"
                  className="text-[10px] fill-muted font-mono"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}
                >
                  {m.total > 0 ? m.label : '—'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
