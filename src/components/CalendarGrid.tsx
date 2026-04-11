import { useState, useRef, useEffect, memo } from 'react'
import { subMonths } from 'date-fns'
import type { Habit, HabitEntry, HabitDayNote } from '../types/index'
import MonthBlock from './MonthBlock'
import NoteModal from './NoteModal'

interface CalendarGridProps {
  habit: Habit
  entries: HabitEntry[]
  notes: Record<string, HabitDayNote>
}

const CalendarGrid = memo(({ habit, entries, notes }: CalendarGridProps) => {
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
          setMonths((prev) => {
            const oldest = prev[prev.length - 1]
            // JavaScript Date month is 0-indexed
            const next = subMonths(new Date(oldest.year, oldest.month - 1), 1)
            return [...prev, { year: next.getFullYear(), month: next.getMonth() + 1 }]
          })
        }
      },
      { threshold: 0.1 }
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

export default CalendarGrid
