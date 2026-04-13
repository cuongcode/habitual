import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from 'lucide-react'
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
  const [label, setLabel] = useState('')
  const [colorKey, setColorKey] = useState<ColorKey>('rust')
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const addCategory = useHabitStore(s => s.addCategory)
  const updateCategory = useHabitStore(s => s.updateCategory)
  const deleteCategory = useHabitStore(s => s.deleteCategory)
  const showToast = useUIStore(s => s.showToast)

  // Reset or initialize state when opening
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setLabel(categoryToEdit.label)
        setColorKey(categoryToEdit.colorKey as ColorKey || 'rust')
      } else {
        setLabel('')
        setColorKey('rust')
      }
      setIsConfirmingDelete(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, categoryToEdit])

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
      className="page-enter-fade fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-2xl border border-muted-light p-6 w-full max-w-sm flex flex-col gap-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 relative">
          <button 
            onClick={onClose} 
            className="absolute -right-2 -top-2 p-2 text-muted hover:text-ink transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="font-serif text-[18px] text-ink m-0 pr-8">
            {categoryToEdit ? 'Edit Category' : 'New Category'}
          </h2>
        </div>

        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
            placeholder="Category name"
            className="w-full bg-cream-dark border border-muted-light rounded-xl text-ink focus:outline-none focus:border-rust placeholder:text-muted font-body"
            style={{ padding: '12px 16px', fontSize: '15px' }}
          />

          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider">Color</span>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setColorKey(c.key)}
                  className="relative w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                >
                  {colorKey === c.key && (
                    <Check size={14} color="#F5F0E8" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-2">
          {categoryToEdit ? (
            <button
              className="text-[14px] font-serif transition-colors px-4 py-2 hover:text-rust text-muted"
              onClick={() => setIsConfirmingDelete(!isConfirmingDelete)}
            >
              {isConfirmingDelete ? 'Keep' : 'Delete'}
            </button>
          ) : (
            <div />
          )}
          <button
            className={`flex items-center justify-center font-serif text-[14px] rounded-full px-6 py-2 transition-colors min-w-[100px] ${
              isConfirmingDelete || label.trim()
                ? 'bg-rust text-cream hover:opacity-90 shadow-sm'
                : 'bg-muted-light text-muted cursor-not-allowed border border-muted-light'
            }`}
            onClick={handleSave}
            disabled={!isConfirmingDelete && !label.trim()}
          >
            {isConfirmingDelete ? 'Confirm' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
