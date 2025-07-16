'use client'

import SettingsComponent from '@/components/Settings/SettingsComponent'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useLocale } from 'use-intl'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'

export default function SettingsPage() {
  const { user, setUser, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [locale, setLocale] = useState(currentLocale)
  const t = useTranslations('settings')
  const { showToast } = useToast()
  const initialUserRef = useRef(user)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const toastParam = urlParams.get('toast')
    if (toastParam === 'success') {
      showToast({
        message: t('updateSuccess'),
        type: 'success',
      })
    } else if (toastParam === 'error') {
      showToast({
        message: t('updateError'),
        type: 'error',
      })
    }
    if (toastParam) {
      setTimeout(() => {
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, '', cleanUrl)
      }, 100)
    }
  }, [t, showToast])


  async function handleSave() {
    try {
      if (locale !== currentLocale) {
        const segments = pathname.split('/')
        segments[1] = locale
        router.push(`${segments.join('/')}?toast=success`)
      } else {
        showToast({
          message: t('updateSuccess'),
          type: 'success',
        })
      }
      if (initialUserRef.current !== user) {
        console.log('sending patch')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: user }),
        })

        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }
      } else {
        showToast({
          message: t('updateSuccess'),
          type: 'success',
        })
      }
    } catch (error: unknown) {
      setUser(initialUserRef.current)
      if (locale !== currentLocale) {
        const segments = pathname.split('/')
        segments[1] = locale
        router.push(`${segments.join('/')}?toast=error`)
      } else {
        showToast({
          message: t('updateError'),
          type: 'error',
        })
      }
    }
  }

  return (
      <>
        {loading ? (
          <div></div>
        ) :
          <SettingsComponent
            userName={user}
            setUser={(userName) => setUser(userName)}
            locale={locale}
            setLocale={setLocale}
            handleSave={handleSave} />
        }
      </>
    )
}
