'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/RegisterForm'

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
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json()
        setError(data.message || 'Błąd logowania')
      }
    } catch (error) {
      setError((error as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '2rem' }}>
      <h2 className="text-3xl font-bold underline">Zarejestruj się</h2>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  )
}
