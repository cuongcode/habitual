import type { Category } from '@/types'

interface BasicsTabProps {
  name: string
  setName: (v: string) => void
  nameRef: React.RefObject<HTMLInputElement | null>
  categoryId: string
  setCategoryId: (id: string) => void
  categories: Category[]
  errors: Record<string, string>
}

export function BasicsTab({
  name,
  setName,
  nameRef,
  categoryId,
  setCategoryId,
  categories,
  errors,
}: BasicsTabProps) {
  return (
    <div className="space-y-6">
      {/* Habit Name */}
      <div>
        <label className="mb-2 block font-mono text-label uppercase tracking-wider text-muted">
          Habit Name
        </label>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning walk"
          className="w-full rounded-md border border-muted-light bg-cream px-3 py-2.5 font-body text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-rust"
        />
        {errors.name && <p className="mt-1 font-mono text-label text-rust">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block font-mono text-label uppercase tracking-wider text-muted">
          Category
        </label>

        {categories.length === 0 ? (
          <p className="font-mono text-xs text-muted">No categories yet — add one in Settings.</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(categoryId === cat.id ? 'none' : cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  categoryId === cat.id
                    ? `text-cream bg-${cat.colorKey} border-${cat.colorKey}`
                    : 'border-muted-light bg-cream text-ink'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryId === cat.id ? 'bg-cream' : `bg-${cat.colorKey}`}`}
                />
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {errors.category && (
          <p className="mt-1 font-mono text-label text-rust">{errors.category}</p>
        )}
      </div>
    </div>
  )
}
