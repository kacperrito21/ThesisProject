'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        router.push('/dashboard')
      } else {
        const data = await response.json()
        setError(data.message || 'Błąd logowania')
      }
    } catch (error) {
      setError((error as Error).message)
    }
  }
  const t = useTranslations('auth')

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '2rem' }}>
      <h2>{t('login')}</h2>
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  )
}
