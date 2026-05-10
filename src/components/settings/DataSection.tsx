import { Download, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ImportModal, SectionLabel } from '@/components'
import { useDataExport } from '@/hooks/useDataExport'
import { useHabitStore } from '@/store/habitStore'
import { useTranslation } from '@/i18n/useTranslation'

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
          <div className="flex items-center gap-4">
            <Download className="h-[18px] w-[18px] shrink-0 text-rust" />
            <div className="flex flex-col">
              <span className="mb-1 font-serif text-[15px] leading-tight text-ink">
                {t('exportBackup')}
              </span>
              <span className="font-mono text-[11px] text-muted">{t('lastExport')}: {lastExport === 'never' ? t('lastExportNever') : lastExport}</span>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || showExported}
            className={`min-w-[84px] rounded-full border px-3 py-1 font-mono text-[12px] transition-all ${
              showExported
                ? 'border-rust/40 bg-cream-dark text-rust'
                : 'border-rust border-opacity-40 text-rust hover:bg-rust hover:text-cream'
            } disabled:cursor-not-allowed`}
          >
            {showExported ? t('exported') : t('exportButton')}
          </button>
        </div>

        <div className="mx-4 border-t border-muted-light" />

        {/* Import row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Upload className="h-[18px] w-[18px] shrink-0 text-brown" />
            <div className="flex flex-col">
              <span className="mb-1 font-serif text-[15px] leading-tight text-ink">
                {t('restoreBackup')}
              </span>
              <span className="font-mono text-[11px] text-muted">{t('mergeOrReplace')}</span>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="min-w-[84px] rounded-full border border-brown border-opacity-40 px-3 py-1 font-mono text-[12px] text-brown transition-all hover:bg-brown hover:text-cream"
          >
            {t('importButton')}
          </button>
        </div>

        <div className="mx-4 border-t border-muted-light" />

        {/* Trash row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Trash2 className="h-[18px] w-[18px] shrink-0 text-muted" />
            <div className="flex flex-col">
              <span className="mb-1 font-serif text-[15px] leading-tight text-ink">
                {t('trash')}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {trashCount === 0
                  ? t('noDeletedHabits')
                  : `${trashCount} ${trashCount === 1 ? t('item') : t('items')} · ${t('autoDeletes')}`}
              </span>
            </div>
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
