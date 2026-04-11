import { eachDayOfInterval, endOfYear, format, isAfter, isToday, startOfYear } from 'date-fns'
import React, { useMemo } from 'react'
import { useUIStore } from '../store/uiStore'
import type { HabitEntry } from '../types/index'

export const HeatmapCells = React.memo(function HeatmapCells({ entries }: { entries: HabitEntry[] }) {
  const year = useUIStore(state => state.heatmapYear)

  const days = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 0, 1))
    return eachDayOfInterval({ start, end })
  }, [year])

  const completedDates = useMemo(() => {
    return new Set(
      entries
        .filter(e => e.completed)
        .map(e => e.date)
    )
  }, [entries])

  function isFilled(date: Date): boolean {
    return completedDates.has(format(date, 'yyyy-MM-dd'))
  }

  return (
    <div
      className="mode-fade"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(30, 1fr)',
        gap: '2px',
        width: '100%',
      }}
    >
      {days.map(date => (
        <HeatmapCell
          key={format(date, 'yyyy-MM-dd')}
          filled={isFilled(date)}
          isToday={isToday(date)}
          isFuture={isAfter(date, new Date())}
        />
      ))}
      {/* Pad remaining cells to complete the last row */}
      {Array.from({ length: (18 - (days.length % 18)) % 18 }).map((_, i) => (
        <div key={`pad-${i}`} style={{ aspectRatio: '1' }} />
      ))}
    </div>
  )
})

function HeatmapCell({
  filled,
  isToday,
  isFuture,
}: {
  filled: boolean
  isToday: boolean
  isFuture: boolean
}) {

  return (
    <div
      style={{ aspectRatio: '1' }}
      className={`
        rounded-sm
        ${filled
          ? 'bg-rust'
          : isFuture
            ? 'bg-cream border border-muted-light opacity-40'
            : 'bg-cream-dark border border-muted-light'
        }
        ${isToday ? 'ring-1 ring-rust ring-offset-1' : ''}
      `}
    />
  )
}
