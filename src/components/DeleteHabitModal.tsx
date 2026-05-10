import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useHabitStore } from '@/store/habitStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { Habit } from '@/types'

interface DeleteHabitModalProps {
  habit: Habit
  onClose: () => void
}

export function DeleteHabitModal({ habit, onClose }: DeleteHabitModalProps) {
  const { t } = useTranslation()
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    setDeleting(true)
    await useHabitStore.getState().deleteHabit(habit.id)
    onClose()
  }

  return (
    <div
      className="page-enter-fade fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(61, 53, 48, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-2xl border border-muted-light bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <p className="mb-1 font-display text-lg text-ink">{t('deleteHabit')}?</p>

        {/* Habit name */}
        <p className="mb-4 font-mono text-xs text-muted">
          "{habit.name}" {t('deleteHabitWarning')}
        </p>

        {/* Warning detail */}
        <p className="mb-6 font-mono text-xs leading-relaxed text-muted">
          {t('deleteHabitRestoreHint')}
        </p>

        {/* Action row */}
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 font-mono text-sm text-muted">
            {t('cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-full bg-rust px-5 py-2 font-mono text-sm text-cream disabled:opacity-60"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
