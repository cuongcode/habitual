import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowDown } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import HabitCalendarHeader from '../components/HabitCalendarHeader'
import WeekdayHeaders from '../components/WeekdayHeaders'
import CalendarGrid from '../components/CalendarGrid'
import HabitCalendarNav from '../components/HabitCalendarNav'
import EditHabitModal from '../components/EditHabitModal'

export default function HabitCalendarPage() {
  const location = useLocation()
  const { habitId } = useParams<{ habitId: string }>()
  const habit = useHabitStore((state) => 
    state.habits.find((h) => h.id === habitId)
  )
  const entries = useHabitStore((state) => 
    state.entries[habitId ?? '']
  ) ?? []
  const categories = useHabitStore((state) => state.categories)
  const notes = useHabitStore((state) => state.notes)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const category = categories.find((c) => c.id === habit?.categoryId)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    
    // Scroll to bottom to ensure today is visible
    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight })
    }, 10)

    const handleScroll = () => {
      // Show the button if we are scrolled up away from the bottom
      setShowScrollBottom(el.scrollTop < el.scrollHeight - el.clientHeight - 300)
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = () => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }

  if (!habit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-cream">
        <h1 className="text-2xl text-ink font-display" style={{ fontFamily: 'var(--font-display)' }}>
          Habit not found
        </h1>
        <Link 
          to="/" 
          className="mt-6 flex items-center gap-2 text-rust font-mono uppercase text-sm"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <ArrowLeft size={16} />
          Go Back
        </Link>
      </div>
    )
  }

  return (
    <div key={location.pathname} className="page-enter flex flex-col fixed inset-0 bg-cream overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-cream border-b border-muted/10">
        <HabitCalendarHeader habit={habit} category={category} onEditPress={() => setEditOpen(true)} />
        <WeekdayHeaders />
      </div>

      {/* Scrollable Grid */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <CalendarGrid 
          habit={habit} 
          entries={entries} 
          notes={notes} 
        />
      </div>

      {/* Scroll to Today */}
      <button
        onClick={scrollToBottom}
        className={`
          fixed bottom-[84px] right-4 w-10 h-10 bg-rust text-cream rounded-full 
          flex items-center justify-center shadow-lg transition-all duration-300 z-30
          active:scale-90
          ${showScrollBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <ArrowDown size={20} />
      </button>

      {/* Sticky Nav */}
      <HabitCalendarNav habitId={habit.id} />

      {/* Edit Habit Modal */}
      {editOpen && (
        <EditHabitModal habit={habit} onClose={() => setEditOpen(false)} />
      )}
    </div>
  )
}
