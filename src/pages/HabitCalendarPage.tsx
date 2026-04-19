import { ArrowDown, ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import {
  CalendarGrid,
  EditHabitModal,
  HabitCalendarHeader,
  HabitCalendarNav,
  WeekdayHeaders,
} from '@/components'

import { useHabitStore } from '../store/habitStore'
import { getThemeTokens } from '../utils/theme'

export default function HabitCalendarPage() {
  const location = useLocation()
  const { habitId } = useParams<{ habitId: string }>()
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === habitId))
  const entries = useHabitStore((state) => state.entries[habitId ?? '']) ?? []
  const categories = useHabitStore((state) => state.categories)
  const notes = useHabitStore((state) => state.notes)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const category = categories.find((c) => c.id === habit?.categoryId)
  const colorKey = category?.colorKey || 'rust'
  const tokens = getThemeTokens(colorKey)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Scroll to bottom to ensure today is visible
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight })
    })

    let rafId = 0
    const handleScroll = () => {
      // Debounce with rAF to avoid excessive state updates during iOS momentum scroll
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setShowScrollBottom(el.scrollTop < el.scrollHeight - el.clientHeight - 300)
      })
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const scrollToBottom = () => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }

  if (!habit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-10">
        <h1 className="font-display text-2xl text-ink">Habit not found</h1>
        <Link to="/" className="mt-6 flex items-center gap-2 font-mono text-sm uppercase text-rust">
          <ArrowLeft size={16} />
          Go Back
        </Link>
      </div>
    )
  }

  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-cream"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 shrink-0 touch-none border-b border-muted/10 bg-cream">
        <HabitCalendarHeader
          habit={habit}
          category={category}
          onEditPress={() => setEditOpen(true)}
        />
        <WeekdayHeaders />
      </div>

      {/* Scrollable Grid */}
      <div ref={scrollRef} className="-[webkit-overflow-scrolling:touch] flex-1 overflow-y-auto">
        <CalendarGrid habit={habit} entries={entries} notes={notes} colorKey={colorKey} />
      </div>

      {/* Scroll to Today */}
      <button
        onClick={scrollToBottom}
        className={`fixed bottom-[84px] right-4 h-10 w-10 ${tokens.bg} z-30 flex items-center justify-center rounded-full text-cream shadow-lg transition-all duration-300 active:scale-90 ${showScrollBottom ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        <ArrowDown size={20} />
      </button>

      {/* Sticky Nav */}
      <div className="shrink-0 touch-none">
        <HabitCalendarNav habitId={habit.id} />
      </div>

      {/* Edit Habit Modal */}
      {editOpen && <EditHabitModal habit={habit} onClose={() => setEditOpen(false)} />}
    </div>
  )
}
