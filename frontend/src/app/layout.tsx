import '../styles/globals.css'
import { ReactNode } from 'react'
import { SideBar } from '@/components/SideBar'

export const metadata = {
  title: 'Nazwa Aplikacji',
  description: 'Zarządzanie zadaniami',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
    <body>
    <SideBar />
      {children}
    </body>
    </html>
  )
}
