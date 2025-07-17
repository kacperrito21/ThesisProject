'use client'

import SettingsComponent from '@/components/Settings/SettingsComponent'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useLocale } from 'use-intl'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'

export default function SettingsPage() {
  const { user, setUser, loading } = useUser()
  const [localUser, setLocalUser] = useState<string>(user)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [locale, setLocale] = useState(currentLocale)
  const t = useTranslations('settings')
  const { showToast } = useToast()

  useEffect(() => {
    setLocalUser(user)
  }, [user])

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
      if (user !== localUser) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: localUser }),
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
      setUser(localUser)
    } catch (error: unknown) {
      setUser(user)
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
            userName={localUser}
            setUser={(userName) => setLocalUser(userName)}
            locale={locale}
            setLocale={setLocale}
            handleSave={handleSave} />
        }
      </>
    )
}
