import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser: User = {
      id: 1,
      email: email,
      name: 'Demo User',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const mockToken = 'mock-jwt-token';

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const register = async (userData: { email: string; password: string; name: string }) => {
    const mockUser: User = {
      id: 1,
      email: userData.email,
      name: userData.name,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const mockToken = 'mock-jwt-token';

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};