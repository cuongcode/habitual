import { useHabitStore } from '@/store/habitStore'
import { useUIStore } from '@/store/uiStore'

export function useTrash() {
  const trashedItems = useHabitStore((s) => s.trashedItems)
  const restoreHabit = useHabitStore((s) => s.restoreHabit)
  const permanentlyDeleteFromTrash = useHabitStore((s) => s.permanentlyDeleteFromTrash)
  const emptyTrash = useHabitStore((s) => s.emptyTrash)
  const showToast = useUIStore((s) => s.showToast)

  // Sort by most recently deleted first
  const sortedItems = [...trashedItems].sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
  )

  const handleRestore = async (id: string, name: string) => {
    await restoreHabit(id)
    showToast(`"${name}" restored`)
  }

  const handleDelete = async (id: string) => {
    await permanentlyDeleteFromTrash(id)
    showToast('Permanently deleted')
  }

  const handleEmptyTrash = async () => {
    await emptyTrash()
    showToast('Trash emptied')
  }

  return {
    sortedItems,
    handleRestore,
    handleDelete,
    handleEmptyTrash,
    itemCount: sortedItems.length,
  }
}
