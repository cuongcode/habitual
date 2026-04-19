import { format } from 'date-fns'
import { ArrowLeft, Download, Moon, Plus, Sun, Tag, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { CategoryModal, ImportModal } from '@/components'

import { exportData } from '../services/exportService'
import { useHabitStore } from '../store/habitStore'
import { useUIStore } from '../store/uiStore'
import type { Category } from '../types/index'

// ── Category Section ───────────────────────────────────────────────

function CategorySection() {
  const categories = useHabitStore((s) => s.categories)
  const habits = useHabitStore((s) => s.habits)

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
      <div className="mb-3 flex items-center justify-between px-2">
        <h2 className="m-0 font-mono text-[11px] uppercase tracking-wider text-muted">
          Categories
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-rust"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Category list */}
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8">
            <Tag size={28} className="text-muted opacity-40" />
            <p className="m-0 text-center font-mono text-[12px] text-muted">
              No categories yet.{' '}
              <button onClick={handleAddClick} className="text-rust underline">
                Add one
              </button>
            </p>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const isLast = idx === categories.length - 1
            const habitCount = habits.filter((h) => h.categoryId === cat.id).length

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  {/* Category row */}
                  <button
                    className="flex w-full min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80"
                    onClick={() => handleEditClick(cat)}
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full bg-${cat.colorKey}`} />
                    <span className="flex-1 truncate font-serif text-[15px] text-ink">
                      {cat.label}
                    </span>
                    <span className="mt-0.5 shrink-0 font-mono text-[11px] text-muted">
                      {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                    </span>
                  </button>
                </div>
                {!isLast && <div className="mx-4 border-t border-muted-light" />}
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

// ── Appearance Section ─────────────────────────────────────────────

function AppearanceSection() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const options = [
    { value: 'light' as const, label: 'Light', icon: <Sun size={14} /> },
    { value: 'dark' as const, label: 'Dark', icon: <Moon size={14} /> },
    { value: 'system' as const, label: 'System', icon: null },
  ]

  return (
    <div className="flex flex-col">
      <h2 className="m-0 mb-3 px-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        Appearance
      </h2>
      <div className="overflow-hidden rounded-xl border border-muted-light bg-cream-dark p-4">
        <div className="flex gap-1 rounded-xl border border-muted-light bg-cream p-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-center font-mono text-[13px] transition-colors ${
                theme === opt.value ? 'bg-rust text-cream shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Header ─────────────────────────────────────────────────────────

function SettingsHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="m-0 font-serif text-[22px] text-ink">Settings</h1>
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────

function SettingsNav() {
  const navigate = useNavigate()
  return (
    <nav className="pb-safe flex items-center border-t border-muted-light bg-cream px-6 py-3">
      <button
        onClick={() => navigate('/')}
        className="hover:text-ink-dark flex items-center gap-2 text-ink transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
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
  const showToast = useUIStore((state) => state.showToast)

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
      <h2 className="m-0 mb-3 px-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        Data
      </h2>
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
            className={`min-w-[76px] rounded-full border px-3 py-1 font-mono text-[12px] transition-colors ${
              showExported
                ? 'border-rust/40 bg-cream-dark text-rust'
                : 'border-rust border-opacity-40 text-rust hover:bg-rust hover:text-cream'
            }`}
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
            className="min-w-[76px] rounded-full border border-brown border-opacity-40 px-3 py-1 font-mono text-[12px] text-brown transition-colors hover:bg-brown hover:text-cream"
          >
            Import
          </button>
        </div>
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}

// ── About Section ──────────────────────────────────────────────────

function AboutSection() {
  return (
    <div className="flex flex-col items-center justify-center border-t border-muted-light py-10">
      <h3 className="mb-1 mt-0 font-serif text-[18px] text-ink">Habitual</h3>
      <p className="m-0 mb-3 font-mono text-[11px] text-muted">Version 1.1.0</p>
      <p className="m-0 max-w-[200px] text-center font-serif text-[13px] italic text-muted">
        A quiet place to build better habits.
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const location = useLocation()
  return (
    <div
      key={location.pathname}
      className="page-enter fixed inset-0 flex flex-col overflow-hidden bg-cream"
    >
      <div className="sticky top-0 z-10 shrink-0 border-b border-muted-light bg-cream">
        <SettingsHeader />
      </div>
      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          <CategorySection />
          <AppearanceSection />
          <DataSection />
        </div>
        <div className="mt-8">
          <AboutSection />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 shrink-0">
        <SettingsNav />
      </div>
    </div>
  )
}
