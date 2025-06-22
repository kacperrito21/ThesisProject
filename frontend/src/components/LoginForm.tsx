import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>Hasło</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </div>
      <button type="submit">Zaloguj</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>Nie masz konta?</p>
        <button
          type="button"
          onClick={goToRegister}
          style={{
            background: 'transparent',
            border: '1px solid #ccc',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Zarejestruj się
        </button>
      </div>
    </form>
  );
}
