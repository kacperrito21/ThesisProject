import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, firstName: string) => void;
  error?: string | null;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Hasła nie są identyczne');
      return;
    }
    onSubmit(email, password, firstName);
  };
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Imię</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <label>Adres E-mail</label>
        <input
          type="text"
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
        <label>Powtórz hasło</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </div>
      <button type="submit">Zarejestruj się</button>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>Masz już konto?</p>
        <button
          type="button"
          onClick={goToLogin}
          style={{
            background: 'transparent',
            border: '1px solid #ccc',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Zaloguj się
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </form>
  );
}
