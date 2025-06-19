import { createContext, ReactNode, useContext, useState } from 'react';

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
