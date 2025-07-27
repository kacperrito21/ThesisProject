import { LoginForm } from '@/components/Login/LoginForm'
import { useTranslations } from 'next-intl'
import Brand from '@/components/Brand'

type LoginComponentProps = {
  handleLogin: (email: string, password: string) => Promise<void>
  error: string
}

export function LoginComponent({ handleLogin, error }: LoginComponentProps) {
  const t = useTranslations('auth')
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[var(--color-background)] text-[var(--color-text)]">
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
