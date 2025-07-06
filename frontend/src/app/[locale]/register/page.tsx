'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterComponent } from '@/components/Register/RegisterComponent'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (email: string, password: string, firstName: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName }),
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
      <RegisterComponent handleRegister={handleRegister} error={error} />
    </div>
  )
}
