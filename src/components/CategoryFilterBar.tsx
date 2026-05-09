import { useHabitStore } from '../store/habitStore'

export function CategoryFilterBar() {
  const habits = useHabitStore((s) => s.habits)
  const categories = useHabitStore((s) => s.categories)
  const activeCategoryId = useHabitStore((s) => s.activeCategoryId)
  const setActiveCategoryId = useHabitStore((s) => s.setActiveCategoryId)

  const hasNoneCategoryHabits = habits.some((h) => !h.categoryId || h.categoryId === 'none')
  const allHabitsAreNoneCategory = habits.length > 0 && habits.every((h) => !h.categoryId || h.categoryId === 'none')
  const showNonePill = hasNoneCategoryHabits && !allHabitsAreNoneCategory

  return (
    <div className="w-full border-t border-muted-light bg-cream">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {/* "All" pill — always first */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
            activeCategoryId === null
              ? 'border-muted bg-muted text-cream'
              : 'border-muted bg-cream text-muted'
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeCategoryId === cat.id
                ? `text-cream bg-${cat.colorKey} border-${cat.colorKey}`
                : `border-${cat.colorKey} bg-cream text-${cat.colorKey}`
            }`}
          >
            {cat.label}
          </button>
        ))}

        {/* "None" pill — conditionally rendered */}
        {showNonePill && (
          <button
            onClick={() => setActiveCategoryId('none')}
            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeCategoryId === 'none'
                ? 'border-muted bg-muted text-cream'
                : 'border-muted bg-cream text-muted'
            }`}
          >
            None
          </button>
        )}
      </div>
    </div>
  )
}
