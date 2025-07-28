'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginComponent } from '@/components/Login/LoginComponent'
import { useLoading } from '@/contexts/LoadingContext'
import { useUser } from '@/contexts/UserContext'

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const [, setSearchError] = useState<string | null>(errorParam)
  const [, setVisible] = useState(false)
  const { showLoading, hideLoading } = useLoading()
  const { setUser } = useUser()

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
        const user = await response.json()
        setUser(user.firstName)
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
      <LoginComponent handleLogin={handleLogin} error={error} />
    </div>
  )
}
