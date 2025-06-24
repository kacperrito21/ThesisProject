import '../styles/globals.css'
import { ReactNode } from 'react'
import { AuthenticationProvider } from '@/context/AuthenticationContext'

export const metadata = {
  title: 'Nazwa Aplikacji',
  description: 'Zarządzanie zadaniami',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
    <body>
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
    </body>
    </html>
  )
}
