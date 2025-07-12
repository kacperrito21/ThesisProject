'use client'

import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('common')
  return (
    <div>
      <p>{t('loading')}</p>
    </div>
  )
}
