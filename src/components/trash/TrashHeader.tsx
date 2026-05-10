interface TrashHeaderProps {
  itemCount: number
}

import { useTranslation } from '@/i18n/useTranslation'

export function TrashHeader({ itemCount }: TrashHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="m-0 font-serif text-[22px] text-ink">{t('trash')}</h1>
      {itemCount > 0 && (
        <span className="font-mono text-[11px] text-muted">
          {itemCount} {itemCount === 1 ? t('item') : t('items')}
        </span>
      )}
    </div>
  )
}
