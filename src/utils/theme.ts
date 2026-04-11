import type { DayState } from '../services/scheduleEngine'

export interface ThemeColorTokens {
  text: string
  bg: string
  targetOpen: string
  targetComplete: string
  windowOn: string
  todayBorder: string
  textHover: string
  ring: string
  dot: string
  heatmapFilled: string
  heatmapFuture: string
  heatmapEmpty: string
  heatmapTodayRing: string
}

export const THEME_COLORS: Record<string, ThemeColorTokens> = {
  rust: {
    text: 'text-rust',
    bg: 'bg-rust',
    targetOpen: 'bg-cream-dark border-2 border-rust text-ink',
    targetComplete: 'bg-rust border border-rust text-cream',
    windowOn: 'bg-rust/40 border border-rust/60 text-rust',
    todayBorder: 'border-2 border-rust',
    textHover: 'hover:text-rust',
    ring: 'ring-rust',
    dot: 'bg-rust',
    heatmapFilled: 'bg-rust',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-rust ring-offset-1',
  },
  brown: {
    text: 'text-brown',
    bg: 'bg-brown',
    targetOpen: 'bg-cream-dark border-2 border-brown text-ink',
    targetComplete: 'bg-brown border border-brown text-cream',
    windowOn: 'bg-brown/40 border border-brown/60 text-brown',
    todayBorder: 'border-2 border-brown',
    textHover: 'hover:text-brown',
    ring: 'ring-brown',
    dot: 'bg-brown',
    heatmapFilled: 'bg-brown',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-brown ring-offset-1',
  },
  muted: {
    text: 'text-muted',
    bg: 'bg-muted',
    targetOpen: 'bg-cream-dark border-2 border-muted text-ink',
    targetComplete: 'bg-muted border border-muted text-cream',
    windowOn: 'bg-muted/40 border border-muted/60 text-muted',
    todayBorder: 'border-2 border-muted',
    textHover: 'hover:text-muted',
    ring: 'ring-muted',
    dot: 'bg-muted',
    heatmapFilled: 'bg-muted',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-muted ring-offset-1',
  },
  amber: {
    text: 'text-amber',
    bg: 'bg-amber',
    targetOpen: 'bg-cream-dark border-2 border-amber text-ink',
    targetComplete: 'bg-amber border border-amber text-cream',
    windowOn: 'bg-amber/40 border border-amber/60 text-amber',
    todayBorder: 'border-2 border-amber',
    textHover: 'hover:text-amber',
    ring: 'ring-amber',
    dot: 'bg-amber',
    heatmapFilled: 'bg-amber',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-amber ring-offset-1',
  },
  sage: {
    text: 'text-sage',
    bg: 'bg-sage',
    targetOpen: 'bg-cream-dark border-2 border-sage text-ink',
    targetComplete: 'bg-sage border border-sage text-cream',
    windowOn: 'bg-sage/40 border border-sage/60 text-sage',
    todayBorder: 'border-2 border-sage',
    textHover: 'hover:text-sage',
    ring: 'ring-sage',
    dot: 'bg-sage',
    heatmapFilled: 'bg-sage',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-sage ring-offset-1',
  },
  slate: {
    text: 'text-slate',
    bg: 'bg-slate',
    targetOpen: 'bg-cream-dark border-2 border-slate text-ink',
    targetComplete: 'bg-slate border border-slate text-cream',
    windowOn: 'bg-slate/40 border border-slate/60 text-slate',
    todayBorder: 'border-2 border-slate',
    textHover: 'hover:text-slate',
    ring: 'ring-slate',
    dot: 'bg-slate',
    heatmapFilled: 'bg-slate',
    heatmapFuture: 'bg-cream border border-muted-light opacity-40',
    heatmapEmpty: 'bg-cream-dark border border-muted-light',
    heatmapTodayRing: 'ring-1 ring-slate ring-offset-1',
  },
}

export function getThemeTokens(colorKey?: string): ThemeColorTokens {
  return THEME_COLORS[colorKey || 'rust'] || THEME_COLORS['rust']
}

export function getDayStateStyles(state: DayState, colorKey?: string): string {
  const tokens = getThemeTokens(colorKey)
  switch (state) {
    case 'target-open':
      return tokens.targetOpen
    case 'target-complete':
    case 'window-bonus':
      return tokens.targetComplete
    case 'target-missed':
      return 'bg-cream-dark border border-muted-light text-muted'
    case 'window-on':
      return tokens.windowOn
    case 'window-empty':
      return 'bg-cream border border-muted-light text-muted'
    case 'future':
      return 'bg-cream border border-muted-light text-muted-light'
    default:
      return 'bg-cream border border-muted-light text-muted'
  }
}
