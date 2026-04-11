import { format } from 'date-fns'
import { ArrowLeft, Download, Plus, Tag, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CategoryModal } from '../components/CategoryModal'
import { ImportModal } from '../components/ImportModal'
import { exportData } from '../services/exportService'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'
import type { Category } from '../types/index'
import { colorHex } from '../utils/colors'

// ── Category Section ───────────────────────────────────────────────

function CategorySection() {
  const categories = useHabitStore(s => s.categories)
  const habits     = useHabitStore(s => s.habits)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)

  function handleAddClick() {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  function handleEditClick(cat: Category) {
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="font-mono text-[11px] text-muted uppercase tracking-wider m-0">
          Categories
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 font-mono text-[11px] text-rust uppercase tracking-wide"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Category list */}
      <div className="bg-cream-dark rounded-xl border border-muted-light overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 px-4">
            <Tag size={28} className="text-muted opacity-40" />
            <p className="font-mono text-[12px] text-muted text-center m-0">
              No categories yet.{' '}
              <button
                onClick={handleAddClick}
                className="text-rust underline"
              >
                Add one
              </button>
            </p>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const isLast = idx === categories.length - 1
            const habitCount = habits.filter(h => h.categoryId === cat.id).length

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  {/* Category row */}
                  <button
                    className="flex items-center gap-3 w-full min-w-0 text-left hover:opacity-80 transition-opacity"
                    onClick={() => handleEditClick(cat)}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: colorHex(cat.colorKey) }}
                    />
                    <span className="font-serif text-[15px] text-ink truncate flex-1">{cat.label}</span>
                    <span className="font-mono text-[11px] text-muted shrink-0 mt-0.5">
                      {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                    </span>
                  </button>
                </div>
                {!isLast && <div className="border-t border-muted-light mx-4" />}
              </div>
            )
          })
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={editingCategory}
      />
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
      <p className="font-mono text-[11px] text-muted mb-3 m-0">Version 1.1.0</p>
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
