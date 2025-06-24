'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthentication } from '@/context/AuthenticationContext'
import { RegisterForm } from '@/components/RegisterForm'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const auth = useAuthentication()

  useEffect(() => {
    if (auth?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [auth?.isAuthenticated, router])

  const handleRegister = async (email: string, password: string, firstName: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Wystąpił problem z rejestracją')
      }
      const data = await response.json()
      document.cookie = `token=${data.token}; path=/; secure; samesite=strict`
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '2rem' }}>
      <h2 className="text-3xl font-bold underline">Zarejestruj się</h2>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  )
}
