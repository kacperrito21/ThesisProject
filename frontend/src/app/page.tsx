'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useLoading } from '@/contexts/LoadingContext'
import { useEffect } from 'react'

export default function HomePage() {
  const t = useTranslations('common')
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    const handleStart = () => showLoading()
    const handleDone  = () => hideLoading()

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleDone)
    router.events.on('routeChangeComplete', handleDone)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeError', handleDone)
      router.events.off('routeChangeComplete', handleDone)
    }
  }, [router.events, showLoading, hideLoading])
  return (
    <div>
      <p>{t('loading')}</p>
    </div>
  )
}
