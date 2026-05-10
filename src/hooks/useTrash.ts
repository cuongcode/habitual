import { useHabitStore } from '@/store/habitStore'
import { useUIStore } from '@/store/uiStore'
import { useTranslation } from '@/i18n/useTranslation'

export function useTrash() {
  const trashedItems = useHabitStore((s) => s.trashedItems)
  const restoreHabit = useHabitStore((s) => s.restoreHabit)
  const permanentlyDeleteFromTrash = useHabitStore((s) => s.permanentlyDeleteFromTrash)
  const emptyTrash = useHabitStore((s) => s.emptyTrash)
  const showToast = useUIStore((s) => s.showToast)
  const { t } = useTranslation()

  // Sort by most recently deleted first
  const sortedItems = [...trashedItems].sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
  )

  const handleRestore = async (id: string, name: string) => {
    await restoreHabit(id)
    showToast(t('itemRestored', { name }))
  }

  const handleDelete = async (id: string) => {
    await permanentlyDeleteFromTrash(id)
    showToast(t('permanentlyDeleted'))
  }

  const handleEmptyTrash = async () => {
    await emptyTrash()
    showToast(t('trashEmptied'))
  }

  return {
    sortedItems,
    handleRestore,
    handleDelete,
    handleEmptyTrash,
    itemCount: sortedItems.length,
  }
}
