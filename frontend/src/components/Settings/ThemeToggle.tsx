'use client'
import { useTheme } from '@/providers/ThemeProvider'
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid'

export function ThemeToggle() {
  const { setTheme, resolveTheme } = useTheme()
  const isDark = resolveTheme === 'dark'
  const x = isDark ? 53 : 0

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative flex items-center justify-between w-[90px] h-[40px] px-2 py-1
        rounded-full ${isDark ? 'bg-sky-300' : 'bg-amber-200'} transition-colors duration-500 shadow-md`}
      title={isDark ? 'Ciemny motyw' : 'Jasny motyw'}
    >
      <span
        className={`absolute top-1 left-0.5 w-8 h-8 rounded-full ${isDark ? 'bg-sky-600' : 'bg-amber-500'} shadow-md
          transition-transform duration-300 ease-in-out`}
        style={{ transform: `translateX(${x}px)` }}
      />
      <SunIcon className="w-5 h-5 text-white z-10" />
      <MoonIcon className="w-5 h-5 text-white z-10" />
    </button>
  )
}
