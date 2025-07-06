import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Button from '@/components/Button'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/16/solid'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  error?: string | null
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  const goToRegister = () => {
    router.push('/register')
  }

  const t = useTranslations('auth')

  return (
    <form onSubmit={handleSubmit} className="text-[var(--color-text)] space-y-10">
      <div className="flex items-center bg-white border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm">
        <EnvelopeIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
        />
      </div>

      <div className="flex items-center bg-white border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm">
        <LockClosedIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
        />
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div className="pt-2">
        <Button title={t('login')} type="submit" className="w-full h-12 text-[18px]" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2">
        <p className="text-[16px]">{t('noAccount')}</p>
        <Button title={t('register')} onClick={goToRegister} variant="secondary" />
      </div>
    </form>
  )
}
