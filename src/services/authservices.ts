import { LoginResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 1,
      email: email,
      name: 'Demo User',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return {
      access_token: 'mock-jwt-token',
      user: mockUser
    };
  },

  register: async (userData: { email: string; password: string; name: string }): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 1,
      email: userData.email,
      name: userData.name,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return {
      access_token: 'mock-jwt-token',
      user: mockUser
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    throw new Error('No user found');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};