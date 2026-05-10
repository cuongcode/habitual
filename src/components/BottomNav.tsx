import { CalendarDays, LayoutGrid, LayoutList, type LucideIcon } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/en'
import { useUIStore } from '../store/uiStore'

type HabitsDisplayMode = 'week' | 'year' | 'month'

const modeConfig: Record<HabitsDisplayMode, { icon: LucideIcon; labelKey: TranslationKey }> = {
  week: { icon: LayoutList, labelKey: 'modeWeek' },
  month: { icon: CalendarDays, labelKey: 'modeMonth' },
  year: { icon: LayoutGrid, labelKey: 'modeYear' },
}

const modes: HabitsDisplayMode[] = ['week', 'month', 'year']

export function BottomNav() {
  const { t } = useTranslation()
  const openAddHabitDrawer = useUIStore((s) => s.openAddHabitDrawer)
  const habitsDisplayMode = useUIStore((s) => s.habitsDisplayMode)
  const setHabitsDisplayMode = useUIStore((s) => s.setHabitsDisplayMode)

  function cycleMode() {
    const current = modes.indexOf(habitsDisplayMode)
    const next = modes[(current + 1) % modes.length]
    setHabitsDisplayMode(next)
  }

  const { icon: Icon, labelKey } = modeConfig[habitsDisplayMode]

  return (
    <nav className="pb-safe flex w-full items-center justify-between border-t border-muted-light bg-cream px-6 py-3">
      <div className="h-12 w-12 flex-shrink-0" /> {/* Left slot, empty */}
      <button
        onClick={openAddHabitDrawer}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-rust bg-cream text-rust transition-colors hover:bg-rust hover:text-cream"
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
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
        <button
          onClick={cycleMode}
          className="flex flex-col items-center gap-1 transition-opacity active:opacity-60"
          aria-label="Toggle display mode"
        >
          <Icon size={20} className={habitsDisplayMode === 'week' ? 'text-muted' : 'text-rust'} />
          <span className="font-mono text-[9px] leading-none text-muted">{t(labelKey)}</span>
        </button>
      </div>
    </nav>
  )
}
