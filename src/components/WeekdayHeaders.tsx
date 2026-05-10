import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/en'

export function WeekdayHeaders() {
  const { t } = useTranslation()
  const days: TranslationKey[] = [
    'weekdayMon',
    'weekdayTue',
    'weekdayWed',
    'weekdayThu',
    'weekdayFri',
    'weekdaySat',
    'weekdaySun',
  ]

  return (
    <div className="grid grid-cols-7 bg-cream px-4 pb-2 pt-1">
      {days.map((day) => (
        <div
          key={day}
          className="text-center font-mono text-[10px] uppercase tracking-widest text-muted"
        >
          {t(day)}
        </div>
      ))}
    </div>
  )
}
