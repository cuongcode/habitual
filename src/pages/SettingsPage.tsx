import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AboutSection, AppearanceSection, CategorySection, DataSection } from '@/components'

// ── Header ─────────────────────────────────────────────────────────

function SettingsHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="m-0 font-serif text-[22px] text-ink">Settings</h1>
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────

function SettingsNav() {
  const navigate = useNavigate()
  return (
    <nav className="pb-safe flex items-center border-t border-muted-light bg-cream px-6 py-3">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-ink transition-colors hover:text-rust"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-serif text-[15px]">Habits</span>
      </button>
    </nav>
  )
}

// ── Page ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const location = useLocation()

  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-cream"
    >
      <header className="sticky top-0 z-10 shrink-0 touch-none border-b border-muted-light bg-cream">
        <SettingsHeader />
      </header>

      <main className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          <CategorySection />
          <AppearanceSection />
          <DataSection />
        </div>

        <div className="mt-8">
          <AboutSection />
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 shrink-0 touch-none">
        <SettingsNav />
      </footer>
    </div>
  )
}
