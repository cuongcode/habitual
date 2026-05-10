import { Download, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ImportModal, SectionLabel } from '@/components'
import { useDataExport } from '@/hooks/useDataExport'
import { useTranslation } from '@/i18n/useTranslation'
import { useHabitStore } from '@/store/habitStore'

export function DataSection() {
  const { t } = useTranslation()
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const { lastExport, exporting, showExported, handleExport } = useDataExport()
  const trashCount = useHabitStore((s) => s.trashedItems.length)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <SectionLabel>{t('data')}</SectionLabel>
      </div>
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark">
        {/* Export row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Download className="h-[18px] w-[18px] shrink-0 text-muted" />
              <span className="font-serif text-[15px] leading-tight text-ink">
                {t('exportBackup')}
              </span>
            </div>
            <span className="pl-[30px] font-mono text-[11px] text-muted">
              {t('lastExport')}: {lastExport === 'never' ? t('lastExportNever') : lastExport}
            </span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || showExported}
            className={`min-w-[84px] rounded-full border px-3 py-1 font-mono text-[12px] transition-all ${
              showExported
                ? 'border-rust/40 bg-cream-dark text-rust'
                : 'border-muted border-opacity-40 text-muted hover:bg-rust hover:text-cream'
            } disabled:cursor-not-allowed`}
          >
            {showExported ? t('exported') : t('exportButton')}
          </button>
        </div>

        <div className="mx-4 border-t border-muted-light" />

        {/* Import row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Upload className="h-[18px] w-[18px] shrink-0 text-muted" />
              <span className="font-serif text-[15px] leading-tight text-ink">
                {t('restoreBackup')}
              </span>
            </div>
            <span className="pl-[30px] font-mono text-[11px] text-muted">{t('mergeOrReplace')}</span>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="min-w-[84px] rounded-full border border-muted border-opacity-40 px-3 py-1 font-mono text-[12px] text-muted transition-all hover:bg-brown hover:text-cream"
          >
            {t('importButton')}
          </button>
        </div>

        <div className="mx-4 border-t border-muted-light" />

        {/* Trash row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Trash2 className="h-[18px] w-[18px] shrink-0 text-muted" />
              <span className="font-serif text-[15px] leading-tight text-ink">
                {t('trash')}
              </span>
            </div>
            <span className="pl-[30px] font-mono text-[11px] text-muted">
              {trashCount === 0
                ? t('noDeletedHabits')
                : `${trashCount} ${trashCount === 1 ? t('item') : t('items')} · ${t('autoDeletes')}`}
            </span>
          </div>
          <button
            onClick={() => navigate('/settings/trash')}
            className="min-w-[84px] rounded-full border border-muted border-opacity-40 px-3 py-1 font-mono text-[12px] text-muted transition-all hover:bg-muted hover:text-cream"
          >
            {t('viewButton')}
          </button>
        </div>
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}
