import { Trash2 } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'

export function TrashEmptyState() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 animate-in fade-in zoom-in-95 duration-500">
      <div className="rounded-full bg-muted/5 p-6 text-muted opacity-30">
        <Trash2 size={48} strokeWidth={1.5} />
      </div>
      <p className="m-0 text-center font-serif text-[18px] text-ink">
        {t('trashEmpty')}
      </p>
      <p className="max-w-[200px] m-0 text-center font-mono text-[11px] leading-relaxed text-muted opacity-60">
        {t('trashEmptyDesc')}
      </p>
    </div>
  )
}
