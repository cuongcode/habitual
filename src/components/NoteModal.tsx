import { format, parseISO } from 'date-fns'
import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss'
import { useHabitStore } from '../store/habitStore'

interface NoteModalProps {
  habitId: string
  date: string
  onClose: () => void
}

export function NoteModal({ habitId, date, onClose }: NoteModalProps) {
  const store = useHabitStore()
  const [text, setText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const existingNote = store.getNoteForHabitDate(habitId, date)

  useEffect(() => {
    if (existingNote) {
      setText(existingNote.text)
    }
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [existingNote])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSave = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      if (existingNote) {
        store.deleteNote(habitId, date)
      }
      handleClose()
      return
    }
    store.saveNote(habitId, date, trimmed)
    handleClose()
  }

  const handleDelete = () => {
    store.deleteNote(habitId, date)
    handleClose()
  }

  const formattedDate = format(parseISO(date), 'EEEE, MMMM d')

  const { dragY, handlers } = useSwipeToDismiss(handleClose)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className={`page-enter-fade absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Sheet */}
      <div
        {...handlers}
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : 'transform 0.3s ease',
        }}
        className={`relative w-full max-w-lg rounded-t-2xl border-t border-muted-light bg-cream p-5 shadow-xl ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{formattedDate}</h2>
          <button onClick={handleClose} className="p-1 text-muted hover:text-ink">
            <X size={24} />
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          placeholder="Add a note..."
          className="h-32 w-full resize-none rounded-md border border-muted-light bg-cream p-3 font-body text-ink focus:outline-none focus:ring-1 focus:ring-rust"
        />

        <div className="mb-6 mt-1 flex justify-end">
          <span className="font-mono text-xs text-muted">{text.length} / 280</span>
        </div>

        <div className="flex items-center justify-between">
          {existingNote ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-muted transition-colors hover:text-rust"
            >
              <Trash2 size={18} />
              <span className="text-sm">Delete note</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            className="rounded-full bg-rust px-6 py-2 font-medium text-white transition-transform active:scale-95"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}
