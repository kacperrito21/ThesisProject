'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useLocale, useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'
import { useLoading } from '@/contexts/LoadingContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import SettingsComponent from '@/components/Settings/SettingsComponent'

export default function SettingsPage() {
  const { user, setUser, loading } = useUser()
  const [localUser, setLocalUser] = useState('')

  useEffect(() => {
    if (user) {
      setLocalUser(user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // tylko na pierwsze pojawienie się user

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentLocale = useLocale()
  const [locale, setLocale] = useState(currentLocale)

  const t = useTranslations('settings')
  const { showToast } = useToast()
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    const toast = searchParams.get('toast')
    if (toast === 'success') {
      showToast({ message: t('updateSuccess'), type: 'success' })
    } else if (toast === 'error') {
      showToast({ message: t('updateError'), type: 'error' })
    }
    if (toast) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('toast')
      const q = params.toString()
      router.replace(`${pathname}${q ? `?${q}` : ''}`)
    }
  }, [searchParams, pathname, router, showToast, t])

  async function handleSave() {
    showLoading()
    try {
      if (locale !== currentLocale) {
        const segments = pathname.split('/')
        segments[1] = locale
        const newPath = segments.join('/') || '/'
        const params = new URLSearchParams(searchParams.toString())
        const q = params.toString()
        const href = q ? `${newPath}?${q}` : newPath
        router.push(href)
      }

      if (localUser !== user) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: localUser }),
        })
        if (!res.ok) throw new Error(await res.text())
        setUser(localUser)
      }

      showToast({ message: t('updateSuccess'), type: 'success' })
    } catch (err) {
      console.error(err)
      showToast({ message: t('updateError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  if (loading) return null
  return (
      <SettingsComponent
          userName={localUser}
          setUser={(u) => setLocalUser(u)}
          locale={locale}
          setLocale={setLocale}
          handleSave={handleSave}
      />
  )
}
