import { useEffect, useRef, useState } from 'react'

const GRID_SIZE = 16       // 4×4
const FILLED_COUNT = 3     // always exactly 3 filled
const INTERVAL_MS = 5000   // swap every 1 second

function pickRandom3(): Set<number> {
  const indices = Array.from({ length: GRID_SIZE }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return new Set(indices.slice(0, FILLED_COUNT))
}

interface HabitualLogoProps {
  size?: number   // overall size in px, default 80
}

export function HabitualLogo({ size = 80 }: HabitualLogoProps) {
  const [filledIndices, setFilledIndices] = useState<Set<number>>(
    () => pickRandom3()
  )
  const intervalRef = useRef<number | undefined>(undefined)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) return  // skip interval entirely

    intervalRef.current = window.setInterval(() => {
      setFilledIndices(prev => {
        // Guarantee the new set differs from the previous by at least 1
        let next = pickRandom3()
        // Retry once if identical (extremely rare but possible)
        if (Array.from(next).every(i => prev.has(i))) {
          next = pickRandom3()
        }
        return next
      })
    }, INTERVAL_MS)

    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [prefersReducedMotion])

  const cellSize = (size - 3 * 4) / 4   // 4 cells, 3 gaps of 4px
  const gap = 4
  const radius = cellSize * 0.2          // rounded corners proportional to cell size

  return (
    <div
      style={{ width: size, height: size, position: 'relative' }}
      aria-label="Habitual logo"
      role="img"
    >
      {Array.from({ length: GRID_SIZE }, (_, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = col * (cellSize + gap)
        const y = row * (cellSize + gap)
        const filled = filledIndices.has(i)

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cellSize,
              height: cellSize,
              borderRadius: radius,
              border: `2px solid rgb(var(--color-rust))`,
              backgroundColor: filled ? 'rgb(var(--color-rust))' : 'transparent',
              transition: 'none',
              opacity: filled ? 1 : 0.85,
            }}
          />
        )
      })}
    </div>
  )
}
