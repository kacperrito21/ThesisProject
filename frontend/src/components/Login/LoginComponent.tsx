import { LoginForm } from '@/components/Login/LoginForm'
import { useTranslations } from 'next-intl'

type LoginComponentProps = {
  handleLogin: (email: string, password: string) => Promise<void>
  error: string
}

export function LoginComponent({ handleLogin, error }: LoginComponentProps) {
  const t = useTranslations('auth')
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="rounded-2xl shadow-lg p-10 w-full max-w-md bg-[var(--color-sidebar)]">
        <div className="text-[var(--color-text)] font-semibold text-[30px] text-center mb-6">
          <h2>{t('login')}</h2>
        </div>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  )
}
