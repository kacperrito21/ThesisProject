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
    router.push(`/${lang}/${segments[2]}`)
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitch value={locale} onChangeAction={changeLocale} />
      </div>
      <div className="flex flex-col pt-5">
        <Brand />
      </div>
      <div className="rounded-2xl mt-20 shadow-lg p-10 w-full max-w-md bg-[var(--color-sidebar)]">
        <h2 className="text-[30px] font-semibold text-center mb-6">{t('login')}</h2>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  )
}
