import { useState, useRef } from 'react'
import type { TouchEvent } from 'react'

export function useSwipeToDismiss(onDismiss: () => void, threshold = 80) {
  const startY = useRef<number>(0)
  const isDragging = useRef(false)
  const [dragY, setDragY] = useState(0)

  return {
    dragY,
    handlers: {
      onTouchStart(e: TouchEvent) {
        startY.current = e.touches[0].clientY
        isDragging.current = true
      },
      onTouchMove(e: TouchEvent) {
        if (!isDragging.current) return
        const delta = e.touches[0].clientY - startY.current
        if (delta > 0) setDragY(delta)  // only allow downward drag
      },
      onTouchEnd() {
        isDragging.current = false
        if (dragY > threshold) {
          onDismiss()
        }
        setDragY(0)
      },
    },
  }
}
