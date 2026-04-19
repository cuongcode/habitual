import { Plus, Tag } from 'lucide-react'
import { useState } from 'react'

import { CategoryModal, SectionLabel } from '@/components'
import { useHabitStore } from '@/store/habitStore'
import type { Category } from '@/types'

export function CategorySection() {
  const categories = useHabitStore((s) => s.categories)
  const habits = useHabitStore((s) => s.habits)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)

  function handleAddClick() {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  function handleEditClick(cat: Category) {
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between px-2">
        <SectionLabel>Categories</SectionLabel>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-rust transition-opacity hover:opacity-70"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Category list */}
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8">
            <Tag size={28} className="text-muted opacity-40" />
            <p className="m-0 text-center font-mono text-[12px] text-muted">
              No categories yet.{' '}
              <button onClick={handleAddClick} className="text-rust underline">
                Add one
              </button>
            </p>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const isLast = idx === categories.length - 1
            const habitCount = habits.filter((h) => h.categoryId === cat.id).length

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  {/* Category row */}
                  <button
                    className="flex w-full min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80"
                    onClick={() => handleEditClick(cat)}
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full bg-${cat.colorKey}`} />
                    <span className="flex-1 truncate font-serif text-[15px] text-ink">
                      {cat.label}
                    </span>
                    <span className="mt-0.5 shrink-0 font-mono text-[11px] text-muted">
                      {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                    </span>
                  </button>
                </div>
                {!isLast && <div className="mx-4 border-t border-muted-light" />}
              </div>
            )
          })
        )}
      </div>

      <CategoryModal
        key={isModalOpen ? editingCategory?.id || 'new' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={editingCategory}
      />
    </div>
  )
}
