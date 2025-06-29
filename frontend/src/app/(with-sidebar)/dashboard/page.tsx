'use client'

import { useRouter } from 'next/navigation'

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

  return (
    <div className="bg-white w-full h-full rounded-r-lg">
      <div>Strona główna</div>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Wyloguj się
      </button>
    </div>
  )
}
