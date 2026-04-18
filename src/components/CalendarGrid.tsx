import { subMonths } from 'date-fns'
import { memo,useEffect, useRef, useState } from 'react'

import type { Habit, HabitDayNote,HabitEntry } from '../types/index'
import { MonthBlock } from './MonthBlock'
import { NoteModal } from './NoteModal'

interface CalendarGridProps {
  habit: Habit
  entries: HabitEntry[]
  notes: Record<string, HabitDayNote>
  colorKey?: string
}

export const CalendarGrid = memo(({ habit, entries, notes, colorKey }: CalendarGridProps) => {
  const [months, setMonths] = useState<{ year: number; month: number }[]>(() => {
    const now = new Date()
    // 0 is current month. In flex-col-reverse, it will be at the bottom.
    // 1 is last month, 2 is two months ago. 
    return [0, 1, 2].map((i) => {
      const d = subMonths(now, i)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    })
  })

  const [noteModalDate, setNoteModalDate] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Use rAF to avoid blocking the scroll thread on iOS
          requestAnimationFrame(() => {
            setMonths((prev) => {
              const oldest = prev[prev.length - 1]
              // Load 3 months at a time to reduce re-render frequency
              const batch: { year: number; month: number }[] = []
              let ref = new Date(oldest.year, oldest.month - 1)
              for (let i = 0; i < 3; i++) {
                ref = subMonths(ref, 1)
                batch.push({ year: ref.getFullYear(), month: ref.getMonth() + 1 })
              }
              return [...prev, ...batch]
            })
          })
        }
      },
      // Pre-load before sentinel is visible to prevent visible loading gaps
      { threshold: 0.1, rootMargin: '200px 0px' }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pb-24 flex flex-col-reverse justify-end min-h-full">
      {months.map((m, i) => (
        <MonthBlock
          key={`${m.year}-${m.month}`}
          year={m.year}
          month={m.month}
          habit={habit}
          entries={entries}
          notes={notes}
          isFirst={i === 0}
          onLongPress={setNoteModalDate}
          colorKey={colorKey}
        />
      ))}
      
      {/* Sentinel at the bottom of the DOM so flex-col-reverse places it at the visual top */}
      <div ref={sentinelRef} className="h-20 flex items-center justify-center shrink-0">
        <div className="w-1 h-1 bg-muted/20 rounded-full animate-pulse" />
      </div>

      {noteModalDate && (
        <NoteModal
          habitId={habit.id}
          date={noteModalDate}
          onClose={() => setNoteModalDate(null)}
        />
      )}
    </div>
  )
})

CalendarGrid.displayName = 'CalendarGrid'

