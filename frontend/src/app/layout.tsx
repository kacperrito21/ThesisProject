import '../styles/globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/providers/ThemeProvider'

export const metadata = {
  title: 'Nazwa Aplikacji',
  description: 'Task Manager',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-[var(--color-background)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
