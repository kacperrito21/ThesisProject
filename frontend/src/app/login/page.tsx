'use client'
import { useAuthentication } from '@/context/AuthenticationContext';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter()
  const auth = useAuthentication();

  useEffect(() => {
    if (auth?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [auth?.isAuthenticated, router])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błędne dane logowania');
      }
      router.push('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '2rem' }}>
      <h2>Zaloguj się</h2>
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
};
