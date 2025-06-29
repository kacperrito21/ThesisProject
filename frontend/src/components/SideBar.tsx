'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDaysIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/react/16/solid'

export const SideBar = () => {
  const pathname = usePathname()

  const menuItems = [
    { href: '/dashboard', icon: HomeIcon, label: 'Strona Główna' },
    { href: '/calendar', icon: CalendarDaysIcon, label: 'Kalendarz' },
    { href: '/settings', icon: Cog6ToothIcon, label: 'Ustawienia' },
  ]

  return (
    <div className="flex h-screen pl-10 py-10">
      <aside className="h-full p-10 w-75 rounded-l-lg bg-[var(--color-sidebar)] transition-colors duration-500">
        <h1 className="mb-8 font-semibold text-[30px] text-[var(--color-text)]">To-Do List</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 text-[18px] px-4 py-2 rounded-lg transition-colors duration-500
                  ${
                    isActive
                      ? 'bg-[var(--color-chosen)] text-[var(--color-text)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-hover)]'
                  }
                `}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
