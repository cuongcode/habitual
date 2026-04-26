import { ArrowRight } from 'lucide-react'
import { HabitualLogo } from '../components/HabitualLogo'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="page-enter fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-cream px-6 py-12">
      <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
        {/* Decorative elements */}
        <div className="mb-8 flex justify-center">
          <HabitualLogo size={80} />
        </div>

        <div className="space-y-6 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Build better habits, <br />
            <span className="text-rust italic">one day</span> at a time.
          </h1>
          
          <p className="text-lg leading-relaxed text-muted font-body">
            Habitual is a free, premium tracker designed to help you focus on what truly matters.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <button
            onClick={onGetStarted}
            className="group flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-bold uppercase tracking-widest text-cream transition-transform hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-light mt-4">
            Your data is stored locally
          </p>
        </div>
      </div>
    </div>
  )
}
