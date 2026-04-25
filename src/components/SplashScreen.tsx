interface SplashScreenProps {
  fadeOut?: boolean
}

export function SplashScreen({ fadeOut }: SplashScreenProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream ${
        fadeOut ? 'splash-fade-out' : ''
      }`}
    >
      <h1 className="font-display text-3xl font-bold text-ink">Habitual</h1>
      <div className="mt-4 flex gap-1.5">
        <span className="splash-dot h-1.5 w-1.5 rounded-full bg-rust" style={{ animationDelay: '0ms' }} />
        <span className="splash-dot h-1.5 w-1.5 rounded-full bg-rust" style={{ animationDelay: '150ms' }} />
        <span className="splash-dot h-1.5 w-1.5 rounded-full bg-rust" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
