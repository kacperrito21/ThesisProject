import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../context/AuthenticationContext';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuthentication();

  if (auth?.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  const handleRegister = async (email: string, password: string, firstName: string) => {
    try {
      const response = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Wystąpił problem z rejestracją');
      }

      const data = await response.json();
      auth?.login(data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '2rem' }}>
      <h2>Zarejestruj się</h2>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  );
};
