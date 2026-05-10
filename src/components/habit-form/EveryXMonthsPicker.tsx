import { MonthDayPicker } from './MonthDayPicker'
import { useTranslation } from '@/i18n/useTranslation'

interface EveryXMonthsPickerProps {
  interval: number
  day: number
  anchor: string
  onIntervalChange: (interval: number) => void
  onDayChange: (day: number) => void
  onAnchorChange: (anchor: string) => void
}

export function EveryXMonthsPicker({
  interval,
  day,
  anchor,
  onIntervalChange,
  onDayChange,
  onAnchorChange,
}: EveryXMonthsPickerProps) {
  const { t } = useTranslation()
  const monthValue = anchor ? anchor.substring(0, 7) : ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">{t('everyLabel')}</span>
        <input
          type="number"
          min="2"
          max="99"
          value={interval}
          onChange={(e) => onIntervalChange(Math.floor(Number(e.target.value)))}
          className="w-[60px] rounded-lg border border-muted-light bg-cream px-3 py-2 font-mono text-[15px] text-ink outline-none transition-colors focus:border-rust"
        />
        <span className="font-body text-body text-ink">{t('monthsLabel')}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-body text-body text-ink">{t('startingFrom')}</span>
        <input
          type="month"
          value={monthValue}
          onChange={(e) => {
            if (e.target.value) {
              onAnchorChange(`${e.target.value}-01`)
            }
          }}
          className="rounded-lg border border-muted-light bg-cream px-3 py-2 font-mono text-[15px] text-ink outline-none transition-colors focus:border-rust"
        />
      </div>

      <div className="space-y-2">
        <span className="font-body text-body text-ink">{t('startingOnThe')}</span>
        <MonthDayPicker selected={day} onChange={onDayChange} />
        {day >= 29 && (
          <p className="mt-1 font-mono text-[10px] text-muted">
            {t('skipMonthHint')}
          </p>
        )}
      </div>
    </div>
  )
}
