import { useHabitStore } from '../store/habitStore'

export function CategoryFilterBar() {
  const categories = useHabitStore((s) => s.categories)
  const activeCategoryId = useHabitStore((s) => s.activeCategoryId)
  const setActiveCategoryId = useHabitStore((s) => s.setActiveCategoryId)

  return (
    <div className="w-full bg-cream border-t border-muted-light">
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        {/* "All" pill — always first */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs uppercase tracking-wide transition-colors border font-mono
            ${
              activeCategoryId === null
                ? 'bg-rust border-rust text-cream'
                : 'bg-cream text-ink border-ink'
            }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs uppercase tracking-wide transition-colors border font-mono ${
              activeCategoryId === cat.id
                ? `text-cream bg-${cat.colorKey} border-${cat.colorKey}`
                : 'bg-cream text-ink border-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
