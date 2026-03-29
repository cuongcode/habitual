import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import HabitList from '../components/HabitList'
import CategoryFilterBar from '../components/CategoryFilterBar'
import BottomNav from '../components/BottomNav'
import AddHabitDrawer from '../components/AddHabitDrawer'
import { useUIStore } from '../store/uiStore'

export default function HabitsPage() {
  const navigate = useNavigate()
  const addHabitDrawerOpen = useUIStore((s) => s.addHabitDrawerOpen)

  return (
    <div className="flex flex-col h-screen bg-cream">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3">
        <h1
          className="text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          Habitual
        </h1>
        <button
          onClick={() => navigate('/settings')}
          className="text-ink hover:text-rust transition-colors"
          aria-label="Settings"
        >
          <Settings size={20} color="var(--color-ink)" />
        </button>
      </div>

      {/* Main habit list — scrollable */}
      <HabitList />

      {/* Bottom: category filter + nav */}
      <div className="shrink-0">
        <CategoryFilterBar />
        <BottomNav />
      </div>

      {/* Add Habit Drawer */}
      {addHabitDrawerOpen && <AddHabitDrawer />}
    </div>
  )
}
