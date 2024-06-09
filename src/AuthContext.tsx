import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_TOKEN } from './graphql/users.graphql';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [verifyToken] = useMutation(VERIFY_TOKEN);

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      verifyToken({
        variables: {
          token: token
        }
      }).then((result) => {
        const userData = result.data.verifyToken.data;
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          Cookies.remove('auth-token');
        }
      }).catch((error) => {
        console.error('Error verifying token:', error);
        Cookies.remove('auth-token');
      });
    }
  }, [verifyToken]);

  const logout = () => {
    Cookies.remove('auth-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}