import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FileJson, FileCheck, Loader2 } from 'lucide-react'
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
  
  const initStore = useHabitStore(state => state.init)
  const showToast = useUIStore(state => state.showToast)

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(61, 53, 48, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-2xl border border-muted-light p-6 w-full max-w-sm flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-[18px] text-ink m-0">Restore backup</h2>
          <p className="font-mono text-[11px] text-muted m-0">
            Import a .json file exported from Habitual.
          </p>
        </div>

        <div
          className="border-2 border-dashed border-muted-light rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-2"
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
              <FileJson className="w-8 h-8 text-muted mb-2" />
              <p className="font-serif text-[14px] text-muted m-0">
                Drop your backup file here
              </p>
              <p className="font-mono text-[11px] text-muted-light m-0">
                or tap to browse
              </p>
            </>
          ) : (
            <>
              <FileCheck className="w-8 h-8 text-rust mb-2" />
              <span className="font-serif text-[14px] text-ink truncate w-full px-2">
                {file.name}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {formatFileSize(file.size)}
              </span>
              <button
                className="mt-2 text-[11px] font-mono text-muted py-1 hover:text-ink transition-colors"
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
        
        {error && (
          <p className="font-mono text-[11px] text-rust text-center -mt-2 m-0">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-row p-1 bg-cream-dark rounded-xl border border-muted-light gap-1">
            <button
              className={`flex-1 py-1.5 text-center text-[13px] font-mono transition-colors rounded-lg ${
                mode === 'merge'
                  ? 'bg-rust text-cream shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
              onClick={() => setMode('merge')}
            >
              Merge
            </button>
            <button
              className={`flex-1 py-1.5 text-center text-[13px] font-mono transition-colors rounded-lg ${
                mode === 'replace'
                  ? 'bg-rust text-cream shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
              onClick={() => setMode('replace')}
            >
              Replace
            </button>
          </div>
          <p
            className={`font-mono text-[11px] text-center mt-1 m-0 ${
              mode === 'replace' ? 'text-rust' : 'text-muted'
            }`}
          >
            {mode === 'merge'
              ? 'New data is added. Existing habits are kept.'
              : 'All current data is deleted and replaced.'}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between mt-2">
          <button
            className="text-[14px] font-serif text-muted px-4 py-2 hover:text-ink transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`flex items-center justify-center font-serif text-[14px] rounded-full px-6 py-2 transition-colors min-w-[100px] ${
              file && !isLoading
                ? 'bg-rust text-cream hover:opacity-90'
                : 'bg-muted-light text-muted cursor-not-allowed border border-muted-light'
            }`}
            onClick={handleRestore}
            disabled={!file || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 text-cream animate-spin" /> : 'Restore'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
