import { LoginForm } from '@/components/Login/LoginForm'
import { useLocale, useTranslations } from 'next-intl'
import Brand from '@/components/Brand'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type LoginComponentProps = {
  handleLogin: (email: string, password: string) => Promise<void>
  error: string
}

export function LoginComponent({ handleLogin, error }: LoginComponentProps) {
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
        <h2 className="text-[30px] font-semibold text-center mb-6">
          {t('login')}
        </h2>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  )
}
