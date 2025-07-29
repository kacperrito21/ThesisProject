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
      router.push(`${segments.join('/')}?toast=success`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitch value={locale} onChangeAction={changeLocale} />
      </div>
      <div className="flex flex-col">
        <Brand />
      </div>
      <div className="rounded-2xl pt-10 shadow-lg pb-5 p-10 w-full max-w-md bg-[var(--color-sidebar)]">
        <div className="text-[var(--color-text)] font-semibold text-[30px] text-center mb-6">
          <h2>{t('register')}</h2>
        </div>
        <RegisterForm onSubmit={handleRegister} error={error} />
      </div>
    </div>
  )
}
