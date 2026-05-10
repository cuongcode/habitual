import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { exportData } from '@/services/exportService'
import { useUIStore } from '@/store/uiStore'
import { useTranslation } from '@/i18n/useTranslation'

export function useDataExport() {
  const [lastExport, setLastExport] = useState<string>('never')
  const [exporting, setExporting] = useState(false)
  const [showExported, setShowExported] = useState(false)
  const showToast = useUIStore((state) => state.showToast)
  const { t } = useTranslation()

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
      showToast(t('backupExported'))
      setShowExported(true)
      setTimeout(() => setShowExported(false), 2000)
    } catch (e) {
      console.error('Export failed', e)
      showToast(t('exportFailed'), 'error')
    } finally {
      setExporting(false)
    }
  }

  return {
    lastExport,
    exporting,
    showExported,
    handleExport,
  }
}
