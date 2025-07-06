'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginComponent } from '@/components/Login/LoginComponent'

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginComponent handleLogin={handleLogin} error={error} />
    </div>
  )
}
