import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from '@/i18n/useTranslation'

export function UpdatePrompt() {
  const { t } = useTranslation()
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div
      className="page-enter-fade fixed bottom-[84px] left-4 right-4 z-40 flex items-center gap-3 rounded-2xl border border-muted-light bg-cream p-4 shadow-sm"
      role="alert"
    >
      <div className="flex-1">
        <p className="m-0 font-display text-sm text-ink">
          {offlineReady ? t('appReadyOffline') : t('updateAvailable')}
        </p>
        <p className="m-0 mt-0.5 font-mono text-xs text-muted">
          {offlineReady
            ? t('appReadyOfflineDesc')
            : t('updateAvailableDesc')}
        </p>
      </div>

      <button onClick={close} className="px-2 py-1 font-mono text-xs text-muted">
        {t('installLater')}
      </button>

      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="rounded-full bg-rust px-3 py-1.5 font-mono text-xs text-cream transition-colors hover:bg-rust-light active:scale-95"
        >
          {t('updateAction')}
        </button>
      )}

      {offlineReady && !needRefresh && (
        <button
          onClick={close}
          className="rounded-full bg-sage/20 px-3 py-1.5 font-mono text-xs text-sage transition-colors hover:bg-sage/30 active:scale-95"
        >
          {t('gotIt')}
        </button>
      )}
    </div>
  )
}
