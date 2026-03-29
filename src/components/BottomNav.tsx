import { useUIStore } from '../store/uiStore'

export default function BottomNav() {
  const openAddHabitDrawer = useUIStore((s) => s.openAddHabitDrawer)

  return (
    <nav
      className="w-full bg-cream border-t border-muted-light flex items-center justify-center px-6 py-3 pb-safe"
    >
      <button
        onClick={openAddHabitDrawer}
        className="w-12 h-12 rounded-full border-2 border-rust bg-cream flex items-center justify-center
                   transition-colors hover:bg-rust hover:text-cream text-rust"
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
    </nav>
  )
}
