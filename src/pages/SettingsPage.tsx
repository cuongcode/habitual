import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Download, Upload, Check, Trash2, Plus, Tag } from 'lucide-react'
import { exportData } from '../services/exportService'
import { ImportModal } from '../components/ImportModal'
import { useUIStore } from '../store/uiStore'
import { useHabitStore } from '../store/habitStore'
import type { Category } from '../types/index'

// ── Color palette ──────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { key: 'rust',  hex: '#B5451B' },
  { key: 'brown', hex: '#6B4226' },
  { key: 'muted', hex: '#9C8E85' },
  { key: 'amber', hex: '#C4893A' },
  { key: 'sage',  hex: '#4A7C59' },
  { key: 'slate', hex: '#5B6FA6' },
] as const

type ColorKey = typeof COLOR_OPTIONS[number]['key']

function colorHex(key: string): string {
  return COLOR_OPTIONS.find(c => c.key === key)?.hex ?? '#9C8E85'
}

// ── Category Section ───────────────────────────────────────────────

function CategorySection() {
  const categories = useHabitStore(s => s.categories)
  const habits     = useHabitStore(s => s.habits)
  const addCategory    = useHabitStore(s => s.addCategory)
  const deleteCategory = useHabitStore(s => s.deleteCategory)
  const showToast = useUIStore(s => s.showToast)

  const [showAdd, setShowAdd]       = useState(false)
  const [label, setLabel]           = useState('')
  const [colorKey, setColorKey]     = useState<ColorKey>('rust')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showAdd) inputRef.current?.focus()
  }, [showAdd])

  function resetAdd() {
    setLabel('')
    setColorKey('rust')
    setShowAdd(false)
  }

  async function handleAdd() {
    const trimmed = label.trim()
    if (!trimmed) return
    const newCat: Category = {
      id: crypto.randomUUID(),
      label: trimmed,
      colorKey,
    }
    await addCategory(newCat)
    showToast(`"${trimmed}" added`)
    resetAdd()
  }

  async function handleDelete(cat: Category) {
    const inUse = habits.some(h => h.categoryId === cat.id)
    if (inUse) {
      showToast('Move or delete habits in this category first')
      setDeletingId(null)
      return
    }
    await deleteCategory(cat.id)
    showToast(`"${cat.label}" deleted`)
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="font-mono text-[11px] text-muted uppercase tracking-wider m-0">
          Categories
        </h2>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1 font-mono text-[11px] text-rust uppercase tracking-wide"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Inline add form */}
      {showAdd && (
        <div className="mb-3 p-3 bg-cream-dark border border-muted-light rounded-xl space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            placeholder="Category name"
            className="w-full bg-cream border border-muted-light rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-rust placeholder:text-muted"
            style={{ fontFamily: 'var(--font-body)', padding: '8px 12px', fontSize: '14px' }}
          />

          {/* Color picker */}
          <div className="flex items-center gap-2.5">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setColorKey(c.key)}
                className="relative w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
              >
                {colorKey === c.key && (
                  <Check size={14} color="#F5F0E8" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={resetAdd}
              className="font-mono text-[12px] text-muted px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!label.trim()}
              className="font-mono text-[12px] bg-rust text-cream rounded-full px-4 py-1.5 disabled:opacity-50 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-cream-dark rounded-xl border border-muted-light overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 px-4">
            <Tag size={28} className="text-muted opacity-40" />
            <p className="font-mono text-[12px] text-muted text-center m-0">
              No categories yet.{' '}
              <button
                onClick={() => setShowAdd(true)}
                className="text-rust underline"
              >
                Add one
              </button>
            </p>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const isLast = idx === categories.length - 1
            const isConfirming = deletingId === cat.id
            const habitCount = habits.filter(h => h.categoryId === cat.id).length

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  {/* Left: color dot + label + count */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: colorHex(cat.colorKey) }}
                    />
                    <span className="font-serif text-[15px] text-ink truncate">{cat.label}</span>
                    <span className="font-mono text-[11px] text-muted shrink-0">
                      {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                    </span>
                  </div>

                  {/* Right: delete / confirm */}
                  {isConfirming ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="font-mono text-[11px] text-muted px-2 py-1"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="font-mono text-[11px] bg-rust text-cream rounded-full px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(cat.id)}
                      className="text-muted hover:text-rust transition-colors shrink-0 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                {!isLast && <div className="border-t border-muted-light mx-4" />}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Header ─────────────────────────────────────────────────────────

function SettingsHeader() {
  return (
    <div className="px-4 py-4 flex items-center justify-between">
      <h1 className="font-serif text-[22px] text-ink m-0">Settings</h1>
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────

function SettingsNav() {
  const navigate = useNavigate()
  return (
    <nav className="bg-cream border-t border-muted-light px-6 py-3 pb-safe flex items-center">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-ink hover:text-ink-dark transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-serif text-[15px]">Habits</span>
      </button>
    </nav>
  )
}

// ── Data Section ───────────────────────────────────────────────────

function DataSection() {
  const [lastExport, setLastExport] = useState<string>('never')
  const [exporting, setExporting] = useState(false)
  const [showExported, setShowExported] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const showToast = useUIStore(state => state.showToast)

  useEffect(() => {
    const stored = localStorage.getItem('lastExport')
    if (stored) {
      try {
        const d = new Date(stored)
        setLastExport(format(d, 'MMM d, yyyy h:mm a'))
      } catch {
        setLastExport('never')
      }
    }
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportData()
      const nowStr = new Date().toISOString()
      localStorage.setItem('lastExport', nowStr)
      const d = new Date(nowStr)
      setLastExport(format(d, 'MMM d, yyyy h:mm a'))
      showToast('Backup exported successfully')
      setShowExported(true)
      setTimeout(() => setShowExported(false), 2000)
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <h2 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3 px-2 m-0">
        Data
      </h2>
      <div className="bg-cream-dark rounded-xl border border-muted-light overflow-hidden">

        {/* Export row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Download className="w-[18px] h-[18px] text-rust shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-[15px] text-ink leading-tight mb-1">Export backup</span>
              <span className="font-mono text-[11px] text-muted">Last export: {lastExport}</span>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || showExported}
            className={`font-mono text-[12px] border rounded-full px-3 py-1 transition-colors min-w-[76px] ${
              showExported
                ? 'border-rust/40 text-rust bg-cream-dark'
                : 'border-rust border-opacity-40 text-rust hover:bg-rust hover:text-cream'
            }`}
          >
            {showExported ? 'Exported!' : 'Export'}
          </button>
        </div>

        <div className="border-t border-muted-light mx-4" />

        {/* Import row */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-4">
            <Upload className="w-[18px] h-[18px] text-brown shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-[15px] text-ink leading-tight mb-1">Restore backup</span>
              <span className="font-mono text-[11px] text-muted">Merge or replace your data</span>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="font-mono text-[12px] border border-brown border-opacity-40 text-brown rounded-full px-3 py-1 hover:bg-brown hover:text-cream transition-colors min-w-[76px]"
          >
            Import
          </button>
        </div>

      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  )
}

// ── About Section ──────────────────────────────────────────────────

function AboutSection() {
  return (
    <div className="flex flex-col items-center justify-center py-10 border-t border-muted-light">
      <h3 className="font-serif text-[18px] text-ink mb-1 mt-0">Habitual</h3>
      <p className="font-mono text-[11px] text-muted mb-3 m-0">Version 1.0.0</p>
      <p className="font-serif italic text-[13px] text-muted text-center max-w-[200px] m-0">
        A quiet place to build better habits.
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter flex flex-col fixed inset-0 bg-cream overflow-hidden">
      <div className="sticky top-0 z-10 bg-cream border-b border-muted-light shrink-0">
        <SettingsHeader />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-between">
        <div className="space-y-8">
          <CategorySection />
          <DataSection />
        </div>
        <div className="mt-8">
          <AboutSection />
        </div>
      </div>
      <div className="shrink-0 sticky bottom-0 z-10">
        <SettingsNav />
      </div>
    </div>
  )
}
