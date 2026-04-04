import type { DayState } from '../services/scheduleEngine'

export function getDayStateStyles(state: DayState): string {
  switch (state) {
    case 'target-open':
      return 'bg-cream-dark border-2 border-rust text-ink'
    case 'target-complete':
    case 'window-bonus':
      return 'bg-rust border border-rust text-cream'
    case 'target-missed':
      return 'bg-cream-dark border border-muted-light text-muted'
    case 'window-on':
      return 'bg-rust-light/40 border border-rust-light text-rust'
    case 'window-empty':
      return 'bg-cream border border-muted-light text-muted'
    case 'future':
      return 'bg-cream border border-muted-light text-muted-light'
    default:
      return 'bg-cream border border-muted-light text-muted'
  }
}
