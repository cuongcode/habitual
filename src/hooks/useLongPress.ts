import { useRef } from 'react'

export function useLongPress(onLongPress: () => void, delay = 800) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isLongPress = useRef(false)

  function start() {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, delay)
  }

  function cancel() {
    clearTimeout(timerRef.current)
  }

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
    },
    isLongPress,
  }
}
