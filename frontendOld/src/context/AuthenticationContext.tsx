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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/auth/verify', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (response.ok) {
          setToken(savedToken);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
      }

      setIsLoading(false);
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
  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <AuthenticationContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = (): AuthenticationContextType | null =>
  useContext(AuthenticationContext);
