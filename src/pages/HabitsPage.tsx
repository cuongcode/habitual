import { useNavigate } from 'react-router-dom'
import HabitList from '../components/HabitList'
import CategoryFilterBar from '../components/CategoryFilterBar'
import BottomNav from '../components/BottomNav'

export default function HabitsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-cream relative">
      {/* Settings gear — top right */}
      <button
        onClick={() => navigate('/settings')}
        className="absolute top-3 right-3 z-10 text-ink hover:text-rust transition-colors"
        aria-label="Settings"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1v2M10 17v2M1 10h2M17 10h2" />
          <path d="M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4" />
          <path d="M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4" />
        </svg>
      </button>

      {/* Main habit list — scrollable */}
      <HabitList />

      {/* Bottom: category filter + nav */}
      <div className="shrink-0">
        <CategoryFilterBar />
        <BottomNav />
      </div>
    </div>
  )
}
