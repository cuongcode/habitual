import { format, startOfDay, subDays } from 'date-fns'
import { Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AddHabitDrawer, BottomNav, CategoryFilterBar, HabitList, YearNav } from '@/components'

import { useUIStore } from '../store/uiStore'

export default function HabitsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const addHabitDrawerOpen = useUIStore((s) => s.addHabitDrawerOpen)
  const habitsDisplayMode = useUIStore((s) => s.habitsDisplayMode)

  const today = startOfDay(new Date())
  const cellDates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))

  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-cream"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex shrink-0 touch-none flex-col bg-cream">
        <div className="pt-safe flex shrink-0 flex-col border-b border-muted-light bg-cream">
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <h1 className="font-display text-xl font-bold text-ink">Habitual</h1>
            <button
              onClick={() => navigate('/settings')}
              className="text-ink transition-colors hover:text-rust"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          {habitsDisplayMode === 'week' && (
            <div className="flex items-center gap-2 px-4 pb-1">
              <div className="flex-1" />
              <div className="flex shrink-0 gap-1">
                {cellDates.map((date, i) => (
                  <div
                    key={i}
                    className="w-7 text-center font-mono text-[10px] uppercase tracking-widest text-muted"
                  >
                    {format(date, 'EEEEEE')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {habitsDisplayMode === 'heatmap' && <YearNav />}
      </div>

      {/* Main habit list — scrollable */}
      <HabitList />

      {/* Bottom: category filter + nav */}
      <div className="shrink-0 touch-none">
        <CategoryFilterBar />
        <BottomNav />
      </div>

      {/* Add Habit Drawer */}
      {addHabitDrawerOpen && <AddHabitDrawer />}
    </div>
  )
}
