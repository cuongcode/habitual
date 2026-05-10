export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/en'

interface WeekdayPickerProps {
  selected: Weekday[]
  onChange: (wds: Weekday[]) => void
}

export function WeekdayPicker({ selected, onChange }: WeekdayPickerProps) {
  const { t } = useTranslation()
  // Display Mon–Sun; map display index → JS weekday (0=Sun)
  const displayToJS: Weekday[] = [1, 2, 3, 4, 5, 6, 0]
  const WEEKDAY_LABELS_KEYS: TranslationKey[] = [
    'weekdayMon',
    'weekdayTue',
    'weekdayWed',
    'weekdayThu',
    'weekdayFri',
    'weekdaySat',
    'weekdaySun',
  ]
  const atMax = selected.length >= 6

  function toggle(jsDay: Weekday) {
    if (selected.includes(jsDay)) {
      // Never deselect the last one
      if (selected.length === 1) return
      onChange(selected.filter((d) => d !== jsDay))
    } else {
      // Cap at 6
      if (atMax) return
      onChange([...selected, jsDay])
    }
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        {WEEKDAY_LABELS_KEYS.map((labelKey, i) => {
          const jsDay = displayToJS[i]
          const isSelected = selected.includes(jsDay)
          const isDisabled = atMax && !isSelected
          return (
            <button
              key={labelKey}
              type="button"
              onClick={() => toggle(jsDay)}
              className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-all active:scale-90 ${isSelected ? 'bg-rust text-cream' : 'bg-cream-dark text-ink'} ${isDisabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'}`}
            >
              {t(labelKey).slice(0, 2)}
            </button>
          )
        })}
      </div>
      {atMax && (
        <p className="mt-2 text-center font-mono text-label text-muted">{t('maxDaysSelected')}</p>
      )}
    </div>
  )
}
