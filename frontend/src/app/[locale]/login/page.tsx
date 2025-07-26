'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginComponent } from '@/components/Login/LoginComponent'
import { useTranslations } from 'next-intl'
import ToastMessage from '@/components/ToasMessage'
import { useLoading } from '@/contexts/LoadingContext'

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const t = useTranslations('auth')
  const [searchError, setSearchError] = useState<string | null>(errorParam)
  const [visible, setVisible] = useState(false)
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    if (errorParam === 'session-expired') {
      setSearchError(errorParam)
      setVisible(true)

      const hideTimer = setTimeout(() => {
        setVisible(false)
        const cleanupTimer = setTimeout(() => {
          setSearchError(null)
        }, 300)
        return () => clearTimeout(cleanupTimer)
      }, 5000)

      return () => clearTimeout(hideTimer)
    }
  }, [errorParam])

  const handleLogin = async (email: string, password: string) => {
    try {
      showLoading()
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
    } finally {
      hideLoading()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {searchError === 'session-expired' && <ToastMessage message={t('jwtExpired')} type="error" />}
      <LoginComponent handleLogin={handleLogin} error={error} />
    </div>
  )
}
