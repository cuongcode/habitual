import { subMonths } from 'date-fns'
import { memo, useEffect, useRef, useState } from 'react'

import type { Habit, HabitDayNote, HabitEntry } from '../types/index'
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

  const isFetchingRef = useRef(false)

  useEffect(() => {
    // Throttle: allows the browser to settle between loads.
    const timer = setTimeout(() => {
      isFetchingRef.current = false
    }, 100)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          requestAnimationFrame(() => {
            setMonths((prev) => {
              const oldest = prev[prev.length - 1]
              let ref = new Date(oldest.year, oldest.month - 1)
              const batch: { year: number; month: number }[] = []

              // Load 4 months at a time (~1280px).
              // Since this is > rootMargin (800px), it pushes the sentinel out of the trigger zone,
              // preventing the "treadmill" effect while providing enough runway for fast scrolls.
              for (let i = 0; i < 4; i++) {
                ref = subMonths(ref, 1)
                batch.push({ year: ref.getFullYear(), month: ref.getMonth() + 1 })
              }
              return [...prev, ...batch]
            })
          })
        }
      },
      // 800px buffer covers aggressive flings without hitting the "ceiling"
      { threshold: 0.01, rootMargin: '800px 0px' },
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [months.length])

  return (
    <div className="flex min-h-full flex-col-reverse justify-end pb-24">
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
      <div ref={sentinelRef} className="flex h-20 shrink-0 items-center justify-center">
        <div className="h-1 w-1 animate-pulse rounded-full bg-muted/20" />
      </div>

      {noteModalDate && (
        <NoteModal habitId={habit.id} date={noteModalDate} onClose={() => setNoteModalDate(null)} />
      )}
    </div>
  )
})

CalendarGrid.displayName = 'CalendarGrid'
