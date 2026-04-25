import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  TrashEmptyState,
  TrashHeader,
  TrashItemRow,
  TrashNav,
} from '@/components'
import { useTrash } from '@/hooks/useTrash'

export default function TrashPage() {
  const location = useLocation()
  const { sortedItems, handleRestore, handleDelete, handleEmptyTrash, itemCount } =
    useTrash()

  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)

  async function onEmptyTrash() {
    await handleEmptyTrash()
    setShowEmptyConfirm(false)
  }

  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-cream"
    >
      <header className="sticky top-0 z-10 shrink-0 touch-none border-b border-muted-light bg-cream">
        <TrashHeader itemCount={itemCount} />
      </header>

      <main className="flex flex-1 flex-col overflow-y-auto">
        {itemCount === 0 ? (
          <TrashEmptyState />
        ) : (
          <div className="flex flex-col pb-8">
            <div className="divide-y divide-muted-light/50 overflow-hidden">
              {sortedItems.map((item) => (
                <TrashItemRow
                  key={item.id}
                  habitName={item.habit.name}
                  deletedAt={item.deletedAt}
                  entryCount={item.entries.length}
                  noteCount={item.notes.length}
                  onRestore={() => handleRestore(item.id, item.habit.name)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>

            {/* Empty Trash Action */}
            <div className="mt-6 border-t border-muted-light px-4 py-6">
              {!showEmptyConfirm ? (
                <button
                  onClick={() => setShowEmptyConfirm(true)}
                  className="w-full rounded-full border border-rust/20 py-3 text-center font-mono text-[12px] text-rust transition-all hover:bg-rust hover:text-cream active:scale-[0.98]"
                >
                  Empty Trash ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </button>
              ) : (
                <div className="flex flex-col gap-4 rounded-2xl bg-rust/5 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-center font-serif text-[15px] text-ink">
                    Permanently delete all items?
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setShowEmptyConfirm(false)}
                      className="px-6 py-2 font-mono text-[12px] text-muted transition-colors hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onEmptyTrash}
                      className="rounded-full bg-rust px-6 py-2 font-mono text-[12px] text-cream shadow-sm transition-all hover:bg-rust-dark active:scale-95"
                    >
                      Empty
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-10 shrink-0 touch-none">
        <TrashNav />
      </footer>
    </div>
  )
}
