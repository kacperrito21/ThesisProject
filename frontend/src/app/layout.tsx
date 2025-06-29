import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Nazwa Aplikacji',
  description: 'Zarządzanie zadaniami',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-neutral-100">{children}</body>
    </html>
  )
}
