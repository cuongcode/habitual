import { ArrowLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import {
  BestPeriodSection,
  CompletionRateSection,
  HabitStatsHeader,
  HabitStatsNav,
  MonthlyBarChartSection,
  StreakSection,
  TotalCompletionsSection,
} from '@/components'

import {
  getBestPeriod,
  getCompletionRate,
  getCurrentStreak,
  getLongestStreak,
  getMonthlyRates,
  getTotalCompletions,
} from '../services/statsEngine'
import { useHabitStore } from '../store/habitStore'

const EMPTY_ENTRIES: any[] = []

export default function HabitStatsPage() {
  const location = useLocation()
  const { habitId } = useParams<{ habitId: string }>()
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === habitId))
  const entries = useHabitStore((state) => state.entries[habitId ?? ''] ?? EMPTY_ENTRIES)
  const categories = useHabitStore((state) => state.categories)
  const category = categories.find((c) => c.id === habit?.categoryId)
  const colorKey = category?.colorKey || 'rust'

  // Compute all stats once
  const currentStreak = useMemo(
    () => (habit ? getCurrentStreak(habit, entries) : 0),
    [habit, entries],
  )
  const longestStreak = useMemo(
    () => (habit ? getLongestStreak(habit, entries) : 0),
    [habit, entries],
  )
  const completionRate = useMemo(
    () => (habit ? getCompletionRate(habit, entries) : 0),
    [habit, entries],
  )
  const bestPeriod = useMemo(() => (habit ? getBestPeriod(habit, entries) : null), [habit, entries])
  const totalCompletions = useMemo(
    () => (habit ? getTotalCompletions(habit, entries) : 0),
    [habit, entries],
  )
  const monthlyRates = useMemo(
    () => (habit ? getMonthlyRates(habit, entries, 6) : []),
    [habit, entries],
  )

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
      className="page-enter fixed inset-0 flex flex-col overflow-hidden bg-cream"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-muted/10 bg-cream">
        <HabitStatsHeader habit={habit} category={category} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-12 overflow-y-auto scroll-smooth px-4 py-8 pb-32">
        <StreakSection
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          colorKey={colorKey}
        />

        <CompletionRateSection rate={completionRate} colorKey={colorKey} />

        <BestPeriodSection bestPeriod={bestPeriod} colorKey={colorKey} />

        <MonthlyBarChartSection monthlyRates={monthlyRates} colorKey={colorKey} />

        <TotalCompletionsSection total={totalCompletions} colorKey={colorKey} />
      </div>

      {/* Sticky Bottom Nav */}
      <HabitStatsNav habitId={habit.id} />
    </div>
  )
}
