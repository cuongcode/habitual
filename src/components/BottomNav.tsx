import { LayoutGrid,LayoutList } from 'lucide-react'

import { useUIStore } from '../store/uiStore'

export function BottomNav() {
  const openAddHabitDrawer = useUIStore((s) => s.openAddHabitDrawer)
  const habitsDisplayMode = useUIStore((s) => s.habitsDisplayMode)
  const setHabitsDisplayMode = useUIStore((s) => s.setHabitsDisplayMode)

  function cycleMode() {
    const modes = ['week', 'heatmap'] as const
    const current = modes.indexOf(habitsDisplayMode)
    const next = modes[(current + 1) % modes.length]
    setHabitsDisplayMode(next)
  }

  return (
    <nav
      className="w-full bg-cream border-t border-muted-light flex items-center justify-between px-6 py-3 pb-safe"
    >
      <div className="w-12 h-12 flex-shrink-0" /> {/* Left slot, empty */}

      <button
        onClick={openAddHabitDrawer}
        className="w-12 h-12 rounded-full border-2 border-rust bg-cream flex items-center justify-center
                   transition-colors hover:bg-rust hover:text-cream text-rust flex-shrink-0"
        aria-label="Add habit"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="10" y1="4" x2="10" y2="16" />
          <line x1="4" y1="10" x2="16" y2="10" />
        </svg>
      </button>

      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
        <button
          onClick={cycleMode}
          className="flex flex-col items-center gap-1 active:opacity-60 transition-opacity"
          aria-label="Toggle display mode"
        >
          {habitsDisplayMode === 'week' ? (
            <>
              <LayoutList size={20} className="text-muted" />
              <span className="font-mono text-[9px] text-muted leading-none">week</span>
            </>
          ) : (
            <>
              <LayoutGrid size={20} className="text-rust" />
              <span className="font-mono text-[9px] text-rust leading-none">year</span>
            </>
          )}
        </button>
      </div>
    </nav>
  )
}
