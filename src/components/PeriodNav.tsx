import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'
import { useUIStore } from '../store/uiStore'

const currentYear = new Date().getFullYear()

export function PeriodNav() {
  const mode = useUIStore((state) => state.habitsDisplayMode)
  if (mode === 'year') return <YearPeriodNav />
  if (mode === 'month') return <MonthPeriodNav />
  return null
}

function YearPeriodNav() {
  const year = useUIStore((state) => state.heatmapYear)
  const setYear = useUIStore((state) => state.setHeatmapYear)
  const isCurrentYear = year >= currentYear

  return (
    <div className="flex items-center justify-between border-b border-muted-light bg-cream px-6 py-2">
      <button
        onClick={() => setYear(year - 1)}
        className="p-2 text-ink transition-opacity active:opacity-60"
        aria-label="Previous year"
      >
        <ChevronLeft size={18} />
      </button>

      {isCurrentYear ? (
        <span className="font-mono text-sm text-ink">{year}</span>
      ) : (
        <button
          onClick={() => setYear(currentYear)}
          className="font-mono text-sm text-rust transition-opacity active:opacity-60"
          aria-label="Go to current year"
        >
          {year}
        </button>
      )}

      <button
        onClick={() => !isCurrentYear && setYear(year + 1)}
        className={`p-2 transition-opacity ${isCurrentYear ? 'pointer-events-none opacity-20' : 'text-ink active:opacity-60'}`}
        aria-disabled={isCurrentYear}
        aria-label="Next year"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

function MonthPeriodNav() {
  const { lang } = useTranslation()
  const year = useUIStore((state) => state.heatmapYear)
  const month = useUIStore((state) => state.heatmapMonth)
  const setHeatmapMonth = useUIStore((state) => state.setHeatmapMonth)

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  function goBack() {
    if (month === 1) setHeatmapMonth(year - 1, 12)
    else setHeatmapMonth(year, month - 1)
  }

  function goForward() {
    if (isCurrentMonth) return
    if (month === 12) setHeatmapMonth(year + 1, 1)
    else setHeatmapMonth(year, month + 1)
  }

  const date = new Date(year, month - 1, 1)
  const label = new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date)

  return (
    <div className="flex items-center justify-between border-b border-muted-light bg-cream px-6 py-2">
      <button
        onClick={goBack}
        className="p-2 text-ink transition-opacity active:opacity-60"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>

      {isCurrentMonth ? (
        <span className="font-mono text-sm text-ink">{label}</span>
      ) : (
        <button
          onClick={() => setHeatmapMonth(now.getFullYear(), now.getMonth() + 1)}
          className="font-mono text-sm text-rust transition-opacity active:opacity-60"
          aria-label="Go to current month"
        >
          {label}
        </button>
      )}

      <button
        onClick={goForward}
        className={`p-2 transition-opacity ${isCurrentMonth ? 'pointer-events-none opacity-20' : 'text-ink active:opacity-60'}`}
        aria-disabled={isCurrentMonth}
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
