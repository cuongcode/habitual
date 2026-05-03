export const COLOR_OPTIONS = ['rust', 'brown', 'amber', 'sage', 'slate', 'rose'] as const

export type ColorKey = (typeof COLOR_OPTIONS)[number] | 'muted'
