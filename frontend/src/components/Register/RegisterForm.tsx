'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface RegisterFormProps {
  onSubmit: (email: string, password: string, firstName: string) => void
  error?: string | null
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const router = useRouter();

  const t = useTranslations('auth');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert(t('differentPassword'))
      return
    }
    onSubmit(email, password, firstName)
  }

  const goToLogin = () => {
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('firstName')}</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>{t('email')}</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>{t('password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>{t('repeatPassword')}</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </div>
      <button type="submit">{t('register')}</button>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>{t('hasAccount')}</p>
        <button
          type="button"
          onClick={goToLogin}
          style={{
            background: 'transparent',
            border: '1px solid #ccc',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          {t('login')}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </form>
  )
}
