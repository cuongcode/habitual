import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('installDismissed') === 'true',
  )

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  if (!deferredPrompt || dismissed) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem('installDismissed', 'true')
  }

  return (
    <div className="page-enter-fade fixed bottom-[84px] left-4 right-4 z-40 flex items-center gap-3 rounded-2xl border border-muted-light bg-cream p-4 shadow-sm">
      <div className="flex-1">
        <p className="m-0 font-display text-sm text-ink">Add to home screen</p>
        <p className="m-0 mt-0.5 font-mono text-xs text-muted">Use Habitual like a native app</p>
      </div>
      <button onClick={handleDismiss} className="px-2 py-1 font-mono text-xs text-muted">
        Later
      </button>
      <button
        onClick={handleInstall}
        className="rounded-full bg-rust px-3 py-1.5 font-mono text-xs text-cream"
      >
        Install
      </button>
    </div>
  )
}
