export const COLOR_OPTIONS = [
  { key: 'rust',  hex: '#B5451B' },
  { key: 'brown', hex: '#6B4226' },
  { key: 'muted', hex: '#9C8E85' },
  { key: 'amber', hex: '#C4893A' },
  { key: 'sage',  hex: '#4A7C59' },
  { key: 'slate', hex: '#5B6FA6' },
] as const

export type ColorKey = typeof COLOR_OPTIONS[number]['key']

export function colorHex(key: string): string {
  return COLOR_OPTIONS.find(c => c.key === key)?.hex ?? '#9C8E85'
}
