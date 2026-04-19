import { Check, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'
import type { Category } from '../types/index'
import { COLOR_OPTIONS, type ColorKey } from '../utils/colors'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryToEdit?: Category
}

export function CategoryModal({ isOpen, onClose, categoryToEdit }: CategoryModalProps) {
  const [label, setLabel] = useState(() => categoryToEdit?.label ?? '')
  const [colorKey, setColorKey] = useState<ColorKey>(
    () => (categoryToEdit?.colorKey as ColorKey) || 'rust',
  )
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addCategory = useHabitStore((s) => s.addCategory)
  const updateCategory = useHabitStore((s) => s.updateCategory)
  const deleteCategory = useHabitStore((s) => s.deleteCategory)
  const showToast = useUIStore((s) => s.showToast)

  // Handle autofocus when opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSave() {
    if (isConfirmingDelete && categoryToEdit) {
      await deleteCategory(categoryToEdit.id)
      showToast(`Category "${categoryToEdit.label}" deleted`)
      onClose()
      return
    }

    const trimmed = label.trim()
    if (!trimmed) return

    if (categoryToEdit) {
      await updateCategory(categoryToEdit.id, { label: trimmed, colorKey })
      showToast(`Category "${trimmed}" updated`)
    } else {
      const newCat: Category = {
        id: crypto.randomUUID(),
        label: trimmed,
        colorKey,
      }
      await addCategory(newCat)
      showToast(`Category "${trimmed}" added`)
    }
    onClose()
  }

  return createPortal(
    <div
      className="page-enter-fade fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-muted-light bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col gap-1">
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 p-2 text-muted transition-colors hover:text-ink"
          >
            <X size={20} />
          </button>
          <h2 className="m-0 pr-8 font-serif text-[18px] text-ink">
            {categoryToEdit ? 'Edit Category' : 'New Category'}
          </h2>
        </div>

        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
            }}
            placeholder="Category name"
            className="w-full rounded-xl border border-muted-light bg-cream-dark px-4 py-3 font-body text-body text-ink placeholder:text-muted focus:border-rust focus:outline-none"
          />

          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Color</span>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColorKey(c)}
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110 bg-${c}`}
                >
                  {colorKey === c && <Check size={14} color="#F5F0E8" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          {categoryToEdit ? (
            <button
              className="px-4 py-2 font-serif text-[14px] text-muted transition-colors hover:text-rust"
              onClick={() => setIsConfirmingDelete(!isConfirmingDelete)}
            >
              {isConfirmingDelete ? 'Keep' : 'Delete'}
            </button>
          ) : (
            <div />
          )}
          <button
            className={`flex min-w-[100px] items-center justify-center rounded-full px-6 py-2 font-serif text-[14px] transition-colors ${
              isConfirmingDelete || label.trim()
                ? 'bg-rust text-cream shadow-sm hover:opacity-90'
                : 'cursor-not-allowed border border-muted-light bg-muted-light text-muted'
            }`}
            onClick={handleSave}
            disabled={!isConfirmingDelete && !label.trim()}
          >
            {isConfirmingDelete ? 'Confirm' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
