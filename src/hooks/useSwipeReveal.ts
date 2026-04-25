import { useCallback, useEffect, useRef, useState } from 'react'

const REVEAL_WIDTH = 128 // px — width of the revealed action panel (2 buttons × 64px)
const SWIPE_THRESHOLD = 60 // px — minimum swipe distance to snap open

export function useSwipeReveal(
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  enabled: boolean = true,
) {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const isDragging = useRef(false)
  const isHorizontal = useRef<boolean | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  // Store latest values in refs so the native listener always reads current state
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const dragOffsetRef = useRef(dragOffset)
  dragOffsetRef.current = dragOffset

  // Ref to the element we attach native listeners to
  const elementRef = useRef<HTMLDivElement | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    if (!enabledRef.current) return
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isDragging.current = true
    isHorizontal.current = null
  }

  // Native touchmove handler — attached with { passive: false } so preventDefault works
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !enabledRef.current) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // Determine gesture direction on first move
    if (isHorizontal.current === null) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }

    // Only handle horizontal swipes — let vertical scroll pass through
    if (!isHorizontal.current) return
    e.preventDefault()

    if (isOpenRef.current) {
      // Already open: swipe right to close (positive dx reduces offset)
      const offset = Math.max(0, Math.min(REVEAL_WIDTH, REVEAL_WIDTH - dx))
      setDragOffset(offset)
    } else {
      // Closed: allow swipe left only (negative dx)
      const offset = Math.max(0, Math.min(REVEAL_WIDTH, -dx))
      setDragOffset(offset)
    }
  }, [])

  function onTouchEnd() {
    if (!isDragging.current || !enabledRef.current) return
    isDragging.current = false

    // If no drag movement detected (simple tap), don't trigger open/close
    if (isHorizontal.current === null) return

    if (isOpenRef.current) {
      // If dragged right enough, close
      if (dragOffsetRef.current < REVEAL_WIDTH - SWIPE_THRESHOLD) {
        onCloseRef.current()
      } else {
        // Snap back open
      }
    } else {
      // If dragged left enough, open
      if (dragOffsetRef.current > SWIPE_THRESHOLD) {
        onOpenRef.current()
      }
      // Otherwise snap back closed
    }
    setDragOffset(0)
  }

  // Attach native touchmove with { passive: false }
  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleTouchMove])

  // When dragging: -dragOffset (works for both open→close and close→open)
  // When open + no drag: -REVEAL_WIDTH
  // When closed + no drag: 0
  const translateX =
    dragOffset > 0 ? -dragOffset : isOpen ? -REVEAL_WIDTH : 0

  return {
    translateX,
    isDragging: dragOffset > 0,
    ref: elementRef,
    handlers: { onTouchStart, onTouchEnd },
  }
}
