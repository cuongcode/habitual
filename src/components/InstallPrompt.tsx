import { useEffect,useState } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('installDismissed') === 'true'
  )

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt || dismissed) return null

  async function handleInstall() {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem('installDismissed', 'true')
  }

  return (
    <div className="fixed bottom-[84px] left-4 right-4 z-40 bg-cream border border-muted-light rounded-2xl p-4 shadow-sm flex items-center gap-3 page-enter-fade">
      <div className="flex-1">
        <p className="font-display text-ink text-sm m-0">Add to home screen</p>
        <p className="font-mono text-muted text-xs mt-0.5 m-0">Use Habitual like a native app</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-muted font-mono text-xs px-2 py-1"
      >
        Later
      </button>
      <button
        onClick={handleInstall}
        className="bg-rust text-cream font-mono text-xs px-3 py-1.5 rounded-full"
      >
        Install
      </button>
    </div>
  )
}
