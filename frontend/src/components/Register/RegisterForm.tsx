'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/16/solid'
import Button from '@/components/Button'

interface RegisterFormProps {
  onSubmit: (email: string, password: string, firstName: string) => void
  error?: string | null
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const t = useTranslations('auth')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert(t('differentPassword'))
      return
    }
    onSubmit(email, password, firstName)
  }

  const goToLogin = () => router.push('/login')

  const inputStyle = 'w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm'

  const wrapperStyle =
    'flex items-center bg-white border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm'

  return (
    <form onSubmit={handleSubmit} className="text-black space-y-10">
      <div className={wrapperStyle}>
        <UserIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="text"
          placeholder={t('firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={inputStyle}
        />
      </div>

      <div className={wrapperStyle}>
        <EnvelopeIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputStyle}
        />
      </div>

      <div className={wrapperStyle}>
        <LockClosedIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputStyle}
        />
      </div>

      <div className={wrapperStyle}>
        <LockClosedIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <input
          type="password"
          placeholder={t('repeatPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={inputStyle}
        />
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <div className="pt-2">
        <Button title={t('register')} type="submit" className="w-full h-12 text-[18px]" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2">
        <p className="text-[16px] text-[var(--color-text)]">{t('hasAccount')}</p>
        <Button title={t('login')} onClick={goToLogin} variant="secondary" />
      </div>
    </form>
  )
}
