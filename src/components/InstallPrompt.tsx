import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const isIOS = () => {
  if (typeof window === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
  )
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('installDismissed') === 'true',
  )

  useEffect(() => {
    // Standard PWA prompt (Chrome/Edge/Android)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)

    // Safari/iOS manual prompt detection
    // Only show if it's iOS/Safari and not already installed
    if (isIOS() && !isStandalone()) {
      setShowIOSPrompt(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  if (dismissed) return null
  if (!deferredPrompt && !showIOSPrompt) return null

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

  // iOS Instruction UI
  if (showIOSPrompt && !deferredPrompt) {
    return (
      <div className="page-enter-fade fixed bottom-[84px] left-4 right-4 z-40 flex flex-col gap-3 rounded-2xl border border-muted-light bg-cream p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="m-0 font-display text-sm text-ink font-medium">Add to home screen</p>
            <p className="m-0 mt-0.5 font-mono text-[10px] text-muted uppercase tracking-wider">Use Habitual like a native app</p>
          </div>
          <button onClick={handleDismiss} className="px-2 py-1 font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase">
            Later
          </button>
        </div>
        
        <div className="mt-1 flex items-center gap-3 rounded-xl bg-muted-light/20 p-3 text-xs text-ink border border-muted-light/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rust/10 text-rust">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <p className="flex-1 leading-relaxed">
            Tap the <span className="font-semibold text-rust">Share</span> icon below and select <span className="font-semibold text-rust">"Add to Home Screen"</span> from the menu.
          </p>
        </div>
      </div>
    )
  }

  // Standard Install UI
  return (
    <div className="page-enter-fade fixed bottom-[84px] left-4 right-4 z-40 flex items-center gap-3 rounded-2xl border border-muted-light bg-cream p-4 shadow-sm">
      <div className="flex-1">
        <p className="m-0 font-display text-sm text-ink font-medium">Add to home screen</p>
        <p className="m-0 mt-0.5 font-mono text-[10px] text-muted uppercase tracking-wider">Use Habitual like a native app</p>
      </div>
      <button onClick={handleDismiss} className="px-2 py-1 font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase">
        Later
      </button>
      <button
        onClick={handleInstall}
        className="rounded-full bg-rust px-4 py-2 font-mono text-[10px] text-cream shadow-sm hover:bg-rust-dark transition-colors uppercase tracking-widest font-bold"
      >
        Install
      </button>
    </div>
  )
}
