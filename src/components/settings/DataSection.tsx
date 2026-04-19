import { Download, Upload } from 'lucide-react'
import { useState } from 'react'

import { ImportModal, SectionLabel } from '@/components'
import { useDataExport } from '@/hooks/useDataExport'

export function DataSection() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const { lastExport, exporting, showExported, handleExport } = useDataExport()

  return (
    <div className="flex flex-col">
      <SectionLabel>Data</SectionLabel>
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark">
        {/* Export row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Download className="h-[18px] w-[18px] shrink-0 text-rust" />
            <div className="flex flex-col">
              <span className="mb-1 font-serif text-[15px] leading-tight text-ink">
                Export backup
              </span>
              <span className="font-mono text-[11px] text-muted">Last export: {lastExport}</span>
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
            {showExported ? 'Exported!' : 'Export'}
          </button>
        </div>

        <div className="mx-4 border-t border-muted-light" />

        {/* Import row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Upload className="h-[18px] w-[18px] shrink-0 text-brown" />
            <div className="flex flex-col">
              <span className="mb-1 font-serif text-[15px] leading-tight text-ink">
                Restore backup
              </span>
              <span className="font-mono text-[11px] text-muted">Merge or replace your data</span>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="min-w-[84px] rounded-full border border-brown border-opacity-40 px-3 py-1 font-mono text-[12px] text-brown transition-all hover:bg-brown hover:text-cream"
          >
            Import
          </button>
        </div>
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}
