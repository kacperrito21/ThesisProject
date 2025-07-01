'use client'

import { useRouter } from 'next/navigation'
import {useTranslations} from 'next-intl';

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
  const t = useTranslations('common');

  return (
    <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg">
      <div>{t('main')}</div>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Wyloguj się
      </button>
    </div>
  )
}
