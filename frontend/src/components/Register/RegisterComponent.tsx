'use client'

import { RegisterForm } from './RegisterForm'
import { useLocale, useTranslations } from 'next-intl'
import Brand from '@/components/Brand'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageSwitch } from '../LanguageSwitch'

interface RegisterComponentProps {
  handleRegister: (email: string, password: string, firstName: string) => Promise<void>
  error: string
}

export function RegisterComponent({ handleRegister, error }: RegisterComponentProps) {
  const t = useTranslations('auth')
  const currentLocale = useLocale()
  const [locale, setLocale] = useState(currentLocale)
  const router = useRouter()
  const pathname = usePathname()

  const changeLocale = (lang: string) => {
    setLocale(lang)
    const segments = pathname.split('/')
    segments[1] = lang
    router.push(segments.join('/'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitch value={locale} onChange={changeLocale} />
      </div>
      <Brand />
      <div className="rounded-2xl shadow-lg p-10 w-full max-w-md bg-[var(--color-sidebar)]">
        <div className="text-[var(--color-text)] font-semibold text-[30px] text-center mb-6">
          <h2>{t('register')}</h2>
        </div>
        <RegisterForm onSubmit={handleRegister} error={error} />
      </div>
    </div>
  )
}
