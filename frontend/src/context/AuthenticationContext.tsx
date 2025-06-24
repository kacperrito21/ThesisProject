'use client'

import { createContext, useContext } from 'react'

interface AuthenticationContextType {
  logout: () => Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null)

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    window.location.href = '/login'
  }

  return (
    <AuthenticationContext.Provider value={{ logout }}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthentication = () => useContext(AuthenticationContext)
