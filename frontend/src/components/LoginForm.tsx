import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const t = useTranslations('auth')

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>{t('password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </div>
      <button type="submit">{t('login')}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>{t('noAccount')}</p>
        <button
          type="button"
          onClick={goToRegister}
          className="
            background: 'transparent',
            border: '1px solid #ccc',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          "
        >
          {t('register')}
        </button>
      </div>
    </form>
  );
}
