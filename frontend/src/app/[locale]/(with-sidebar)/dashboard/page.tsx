'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardComponent from '@/components/Dashboard/DashboardComponent'

export default function Page() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  interface User {
    email: string
    firstName: string
  }

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error('Błąd podczas pobierania użytkownika:', error)
      }
    }
    fetchUser()
  }, [])

  return <DashboardComponent user={user} handleLogout={handleLogout} />
}
