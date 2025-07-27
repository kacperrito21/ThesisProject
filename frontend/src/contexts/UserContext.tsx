'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserContextType {
  user: string
  setUser: (firstName: string) => void
  fetchUser: () => Promise<void>
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const setUser = (firstName: string) => {
    setUserState(firstName)
    sessionStorage.setItem('user', firstName)
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      setUser(data.firstName)
    } catch (err) {
      console.error('Błąd użytkownika:', err)
      setUser('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user')
    if (savedUser) {
      setUserState(savedUser)
      setLoading(false)
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser: setUserState, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
