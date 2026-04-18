import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useUIStore } from '../store/uiStore'

const currentYear = new Date().getFullYear()

export function YearNav() {
  const year = useUIStore(state => state.heatmapYear)
  const setYear = useUIStore(state => state.setHeatmapYear)
  const isCurrentYear = year >= currentYear

  return (
    <div className="flex items-center justify-between px-6 py-2 border-b border-muted-light bg-cream">
      <button
        onClick={() => setYear(year - 1)}
        className="p-2 text-ink active:opacity-60 transition-opacity"
        aria-label="Previous year"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="font-mono text-ink text-sm">
        {year}
      </span>

      <button
        onClick={() => !isCurrentYear && setYear(year + 1)}
        className={`p-2 transition-opacity ${isCurrentYear ? 'opacity-20 pointer-events-none' : 'text-ink active:opacity-60'}`}
        aria-disabled={isCurrentYear}
        aria-label="Next year"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
