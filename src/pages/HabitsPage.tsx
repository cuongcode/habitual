import { startOfDay, subDays } from 'date-fns'
import { Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AddHabitDrawer, BottomNav, CategoryFilterBar, HabitList, PeriodNav } from '@/components'
import type { TranslationKey } from '@/i18n/en'
import { useTranslation } from '@/i18n/useTranslation'

import { useUIStore } from '../store/uiStore'

const WEEKDAYS_SHORT_MAP: Record<number, TranslationKey> = {
  0: 'weekdaySunShort',
  1: 'weekdayMonShort',
  2: 'weekdayTueShort',
  3: 'weekdayWedShort',
  4: 'weekdayThuShort',
  5: 'weekdayFriShort',
  6: 'weekdaySatShort',
}

export default function HabitsPage() {
  const { t } = useTranslation()
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
            <h1 className="font-display text-xl font-bold text-ink">{t('appName')}</h1>
            <button
              onClick={() => navigate('/settings')}
              className="text-ink transition-colors hover:text-rust"
              aria-label={t('settings')}
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
                    {t(WEEKDAYS_SHORT_MAP[date.getDay()])}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {habitsDisplayMode !== 'week' && <PeriodNav />}
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
