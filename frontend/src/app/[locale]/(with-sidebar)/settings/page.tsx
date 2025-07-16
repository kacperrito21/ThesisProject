'use client'

import SettingsComponent from '@/components/Settings/SettingsComponent'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useLocale } from 'use-intl'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'

export default function SettingsPage() {
  const { user, setUser } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [locale, setLocale] = useState(currentLocale)
  const t = useTranslations('settings')
  const { showToast } = useToast()


  async function handleSave() {
    try {
      console.log('Saving settings:', { user, locale })
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
    } catch (error: unknown) {
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

  return (
      <>
      <SettingsComponent userName={user} setUser={(userName) => setUser(userName)} locale={locale} setLocale={setLocale} handleSave={handleSave} />
      </>
    )
}
