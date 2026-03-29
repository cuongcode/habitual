import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import {
  getCurrentStreak,
  getLongestStreak,
  getCompletionRate,
  getBestPeriod,
  getTotalCompletions,
  getMonthlyRates,
} from '../services/statsEngine'

import HabitStatsHeader from '../components/stats/HabitStatsHeader'
import StreakSection from '../components/stats/StreakSection'
import CompletionRateSection from '../components/stats/CompletionRateSection'
import HeatmapSection from '../components/stats/HeatmapSection'
import BestPeriodSection from '../components/stats/BestPeriodSection'
import MonthlyBarChartSection from '../components/stats/MonthlyBarChartSection'
import TotalCompletionsSection from '../components/stats/TotalCompletionsSection'
import HabitStatsNav from '../components/stats/HabitStatsNav'

const EMPTY_ENTRIES: any[] = []

export default function HabitStatsPage() {
  const { habitId } = useParams<{ habitId: string }>()
  const habit = useHabitStore((state) =>
    state.habits.find((h) => h.id === habitId),
  )
  const entries = useHabitStore((state) =>
    state.entries[habitId ?? ''] ?? EMPTY_ENTRIES,
  )
  const categories = useHabitStore((state) => state.categories)
  const category = categories.find((c) => c.id === habit?.categoryId)

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
  const bestPeriod = useMemo(
    () => (habit ? getBestPeriod(habit, entries) : null),
    [habit, entries],
  )
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
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-cream">
        <h1
          className="text-2xl text-ink font-display"
          style={{ fontFamily: 'var(--font-display)' }}
        >
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
    <div className="flex flex-col h-screen bg-[#FAF9F6]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#FAF9F6] border-b border-muted/10">
        <HabitStatsHeader habit={habit} category={category} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-12 pb-32 scroll-smooth">
        <StreakSection
          currentStreak={currentStreak}
          longestStreak={longestStreak}
        />
        
        <CompletionRateSection rate={completionRate} />
        
        <HeatmapSection habit={habit} entries={entries} />
        
        <BestPeriodSection bestPeriod={bestPeriod} />
        
        <MonthlyBarChartSection monthlyRates={monthlyRates} />
        
        <TotalCompletionsSection total={totalCompletions} />
      </div>

      {/* Sticky Bottom Nav */}
      <HabitStatsNav habitId={habit.id} />
    </div>
  )
}
