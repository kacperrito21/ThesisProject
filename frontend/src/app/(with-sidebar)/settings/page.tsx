'use client'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Page() {
  return (
    <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg">
      Ustawienia
      <div>
        <ThemeToggle />
      </div>
    </div>
  )
}
