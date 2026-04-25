import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { Habit } from '@/types'
import type { ThemeColorTokens } from '@/utils/theme'

interface HabitRowHeaderProps {
  habit: Habit
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
  tokens: ThemeColorTokens
  isOpen: boolean
  isDragActive: React.MutableRefObject<boolean>
}

export function HabitRowHeader({
  habit,
  attributes,
  listeners,
  tokens,
  isOpen,
  isDragActive,
}: HabitRowHeaderProps) {
  const navigate = useNavigate()

  return (
    <>
      <div
        {...attributes}
        {...(isOpen ? {} : listeners)}
        onTouchStart={() => {
          isDragActive.current = true
        }}
        onTouchEnd={() => {
          isDragActive.current = false
        }}
        className="shrink-0 cursor-grab p-1 text-muted active:cursor-grabbing"
        style={{ touchAction: isOpen ? 'auto' : 'none' }}
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      <button
        onClick={() => navigate(`/habit/${habit.id}`)}
        className={`flex-1 truncate text-left text-ink transition-colors ${tokens.textHover} font-body text-body`}
      >
        {habit.name}
      </button>
    </>
  )
}
