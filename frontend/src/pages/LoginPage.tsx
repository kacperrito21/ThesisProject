import { useAuthentication } from '../context/AuthenticationContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuthentication();

  if (auth?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błędne dane logowania');
      }

      const data = await response.json();
      auth?.login(data.token);
      navigate('/dashboard');
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
