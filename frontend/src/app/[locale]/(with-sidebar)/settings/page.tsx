'use client'

import { ThemeToggle } from '@/components/Settings/ThemeToggle'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { UserIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import Button from '@/components/Button'

export default function SettingsPage() {
    const [username, setUsername] = useState('Kacper')

    return (
        <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg p-6 space-y-10">
            <h1 className="text-2xl font-semibold text-[var(--color-text)]">Ustawienia</h1>
            <div className="flex flex-row">
                <div className="flex bg-white w-1/2 border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm max-w-sm">
                    <UserIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
                    />
                </div>
                <div className="flex w-1/2 gap-10 items-center">
                    <span className="text-[var(--color-text)] text-sm ml-auto">Motyw aplikacji</span>
                    <ThemeToggle />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <LanguageSwitch />
            </div>
            <div className="pt-4 ml-auto">
                <Button title="Zapisz" className="px-6 py-2 text-[16px]" />
            </div>
        </div>
    )
}
