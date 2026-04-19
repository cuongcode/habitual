import { useHabitStore } from '../store/habitStore'

export function CategoryFilterBar() {
  const categories = useHabitStore((s) => s.categories)
  const activeCategoryId = useHabitStore((s) => s.activeCategoryId)
  const setActiveCategoryId = useHabitStore((s) => s.setActiveCategoryId)

  return (
    <div className="w-full border-t border-muted-light bg-cream">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {/* "All" pill — always first */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
            activeCategoryId === null
              ? 'border-rust bg-rust text-cream'
              : 'border-ink bg-cream text-ink'
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
                : 'border-ink bg-cream text-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
