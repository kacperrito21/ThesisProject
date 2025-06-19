import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthenticationContextType {
  token: string | null;
  login: (jwtToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setToken(null);
        return new Error('Sesja wygasła proszę zalogować się ponownie');
      }
      try {
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
      }
    };

    checkToken();
  }, []);

  const login = (jwtToken: string) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthenticationContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = (): AuthenticationContextType | null =>
  useContext(AuthenticationContext);
