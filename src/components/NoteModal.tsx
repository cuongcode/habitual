import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Trash2, X } from 'lucide-react'
import { useHabitStore } from '../store/habitStore'
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss'

interface NoteModalProps {
  habitId: string
  date: string
  onClose: () => void
}

export default function NoteModal({ habitId, date, onClose }: NoteModalProps) {
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
        className={`relative w-full max-w-lg bg-cream rounded-t-2xl border-t border-muted-light p-5 shadow-xl ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-ink" style={{ fontFamily: 'var(--font-display)' }}>
            {formattedDate}
          </h2>
          <button onClick={handleClose} className="p-1 text-muted hover:text-ink">
            <X size={24} />
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          placeholder="Add a note..."
          className="w-full h-32 p-3 bg-cream border border-muted-light rounded-md text-ink resize-none focus:outline-none focus:ring-1 focus:ring-rust"
          style={{ fontFamily: 'var(--font-body)' }}
        />
        
        <div className="flex justify-end mt-1 mb-6">
          <span className="text-xs text-muted font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
            {text.length} / 280
          </span>
        </div>

        <div className="flex justify-between items-center">
          {existingNote ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-muted hover:text-rust transition-colors"
            >
              <Trash2 size={18} />
              <span className="text-sm">Delete note</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-rust text-white rounded-full font-medium active:scale-95 transition-transform"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}
