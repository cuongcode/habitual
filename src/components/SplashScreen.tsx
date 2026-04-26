import { HabitualLogo } from './HabitualLogo'

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
      {/* <h1 className="font-display text-3xl font-bold text-ink">Habitual</h1> */}
      <div className="mt-6">
        <HabitualLogo size={64} intervalMs={150} />
      </div>
    </div>
  )
}
