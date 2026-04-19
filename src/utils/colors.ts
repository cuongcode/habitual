export const COLOR_OPTIONS = ['rust', 'brown', 'muted', 'amber', 'sage', 'slate'] as const

export type ColorKey = (typeof COLOR_OPTIONS)[number]
