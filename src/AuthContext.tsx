import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_TOKEN } from './graphql/users.graphql';
import Cookies from 'js-cookie';

// Define el tipo de datos del usuario
interface User {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
// Define el tipo del contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; 
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Nuevo estado para guardar el objeto de datos del usuario
  const [verifyToken] = useMutation(VERIFY_TOKEN);

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      verifyToken().then((result) => {
        const userData = result.data.verifyToken; 
        setUser(userData); 
        setIsAuthenticated(true);
      }).catch(() => {
        Cookies.remove('auth-token');
        setIsAuthenticated(false);
      });
    }
  }, [verifyToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crea un hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};