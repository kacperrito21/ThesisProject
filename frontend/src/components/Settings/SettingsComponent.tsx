'use client'

import { UserIcon } from '@heroicons/react/16/solid'
import { ThemeToggle } from '@/components/Settings/ThemeToggle'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import Button from '@/components/Button'

type SettingsProps = {
  userName: string | undefined
  setUser: (value: string) => void
  locale: string
  setLocale: (locale: string) => void
  handleSave: () => void
}


export default function SettingsComponent({userName, handleSave, setUser, locale, setLocale}: SettingsProps) {

  return (
    <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg p-6 flex flex-col">
      <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-10">Ustawienia</h1>

      <div className="flex flex-col gap-10 flex-1">
        <div className="flex flex-row">
          <div className="flex bg-white w-1/2 border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm max-w-sm">
            <UserIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
            />
          </div>
          <div className="flex w-1/2 gap-10 items-center">
            <span className="text-[var(--color-text)] text-md ml-auto">Motyw aplikacji</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <LanguageSwitch value={locale} onChange={setLocale} />
        </div>
      </div>

      <div className="flex justify-end items-center pr-15 pb-15 mt-auto">
        <Button title="Zapisz" className="px-10 py-2 text-[16px]" onClick={handleSave}/>
      </div>
    </div>
  )
}
