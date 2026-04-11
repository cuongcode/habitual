export const COLOR_OPTIONS = [
  { key: 'rust',  hex: '#B5451B' },
  { key: 'brown', hex: '#6B4226' },
  { key: 'muted', hex: '#9C8E85' },
  { key: 'amber', hex: '#C4893A' },
  { key: 'sage',  hex: '#4A7C59' },
  { key: 'slate', hex: '#5B6FA6' },
] as const

export type ColorKey = typeof COLOR_OPTIONS[number]['key']

/**
 * Returns the resolved color for a given color key.
 * Uses the CSS custom property (which swaps in dark mode) so inline styles stay in sync.
 */
export function colorHex(key: string): string {
  // Try reading from the computed CSS variable
  const varName = `--color-${key}`
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  
  if (val) {
    // If it's a raw RGB sequence (e.g. "181 69 27"), wrap it in rgb()
    if (/^\d+ \d+ \d+$/.test(val)) {
      return `rgb(${val})`
    }
    return val
  }

  // Fallback to static map
  return COLOR_OPTIONS.find(c => c.key === key)?.hex ?? '#9C8E85'
}
