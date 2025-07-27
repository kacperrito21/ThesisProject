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
  const [consent, setConsent] = useState(false)
  const [isRodoOpen, setIsRodoOpen] = useState(false)

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
    <>
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
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={consent}
          required
          onChange={(e) => setConsent(e.target.checked)}
          className="w-5 h-5 mt-2 pr-4 appearance-none border-2 border-green-500 rounded-sm checked:bg-green-500 checked:border-green-500 checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:block checked:after:translate-x-[2px] checked:after:translate-y-[-2px]"
        />
        <label htmlFor="gdprConsent" className="text-sm text-[var(--color-text)]">
          {t('gdprTextStart')}{' '}
          <button
            type="button"
            className="underline text-[var(--color-chosen)]"
            onClick={() => setIsRodoOpen(true)}
          >
            {t('gdprLinkText')}
          </button>
          .
        </label>
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
  {isRodoOpen && (
    <div
      className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center"
      onClick={() => setIsRodoOpen(false)}
    >
      <div
        className="bg-[var(--color-background)] rounded-2xl p-6 max-w-lg mx-4 h-2/3 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{t('gdprTitle')}</h2>

        <p className="whitespace-pre-line flex-1 overflow-y-auto text-sm text-[var(--color-text)] h-max">
          {t('gdprClauseContent')}
        </p>

        <div className="mt-4 flex justify-end shrink-0">
          <Button title={t('close')} onClick={() => setIsRodoOpen(false)} />
        </div>
      </div>
    </div>
  )}
  </>
  )
}
