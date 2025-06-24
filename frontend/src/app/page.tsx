'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthentication } from '@/context/AuthenticationContext'

export default function HomePage() {
  const router = useRouter()
  const auth = useAuthentication()

  useEffect(() => {
    if (!auth) return
    console.log(auth);
    if (auth.token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [auth, router])

  return (
    <div>
      <h1 className="text-2xl font-bold">Witaj w Task Managerze!</h1>
      <p>Ładuję dane użytkownika...</p>
    </div>
  )
}
