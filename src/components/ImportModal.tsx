import { FileCheck, FileJson, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { importData, type ImportMode } from '../services/exportService'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [mode, setMode] = useState<ImportMode>('merge')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initStore = useHabitStore((state) => state.init)
  const showToast = useUIStore((state) => state.showToast)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.json')) {
      setError('Please select a valid .json backup file.')
      setFile(null)
      return
    }
    setError(null)
    setFile(selectedFile)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const handleRestore = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)

    const result = await importData(file, mode)
    if (result.success) {
      await initStore()
      showToast(`Restored ${result.imported.habits} habits, ${result.imported.entries} entries ✓`)
      onClose()
    } else {
      setError(result.error || 'Unknown error occurred.')
    }
    setIsLoading(false)
  }

  return createPortal(
    <div
      className="page-enter-fade fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-muted-light bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="m-0 font-serif text-[18px] text-ink">Restore backup</h2>
          <p className="m-0 font-mono text-[11px] text-muted">
            Import a .json file exported from Habitual.
          </p>
        </div>

        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-light p-8 text-center"
          onClick={() => !file && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {!file ? (
            <>
              <FileJson className="mb-2 h-8 w-8 text-muted" />
              <p className="m-0 font-serif text-[14px] text-muted">Drop your backup file here</p>
              <p className="m-0 font-mono text-[11px] text-muted-light">or tap to browse</p>
            </>
          ) : (
            <>
              <FileCheck className="mb-2 h-8 w-8 text-rust" />
              <span className="w-full truncate px-2 font-serif text-[14px] text-ink">
                {file.name}
              </span>
              <span className="font-mono text-[11px] text-muted">{formatFileSize(file.size)}</span>
              <button
                className="mt-2 py-1 font-mono text-[11px] text-muted transition-colors hover:text-ink"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                  setError(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                × Choose different file
              </button>
            </>
          )}
        </div>

        {error && <p className="m-0 -mt-2 text-center font-mono text-[11px] text-rust">{error}</p>}

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 rounded-xl border border-muted-light bg-cream-dark p-1">
            <button
              className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[13px] transition-colors ${
                mode === 'merge' ? 'bg-rust text-cream shadow-sm' : 'text-muted hover:text-ink'
              }`}
              onClick={() => setMode('merge')}
            >
              Merge
            </button>
            <button
              className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[13px] transition-colors ${
                mode === 'replace' ? 'bg-rust text-cream shadow-sm' : 'text-muted hover:text-ink'
              }`}
              onClick={() => setMode('replace')}
            >
              Replace
            </button>
          </div>
          <p
            className={`m-0 mt-1 text-center font-mono text-[11px] ${
              mode === 'replace' ? 'text-rust' : 'text-muted'
            }`}
          >
            {mode === 'merge'
              ? 'New data is added. Existing habits are kept.'
              : 'All current data is deleted and replaced.'}
          </p>
        </div>

        <div className="mt-2 flex flex-row items-center justify-between">
          <button
            className="px-4 py-2 font-serif text-[14px] text-muted transition-colors hover:text-ink"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`flex min-w-[100px] items-center justify-center rounded-full px-6 py-2 font-serif text-[14px] transition-colors ${
              file && !isLoading
                ? 'bg-rust text-cream hover:opacity-90'
                : 'cursor-not-allowed border border-muted-light bg-muted-light text-muted'
            }`}
            onClick={handleRestore}
            disabled={!file || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-cream" /> : 'Restore'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
