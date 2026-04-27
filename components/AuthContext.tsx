'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  subscription: 'free' | 'pro';
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateSubscription: (plan: 'free' | 'pro') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockup_studio_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setTimeout(() => {
          setUser(parsed);
        }, 0);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const login = (email: string) => {
    const newUser: User = { email, subscription: 'free' };
    setUser(newUser);
    localStorage.setItem('mockup_studio_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockup_studio_user');
  };

  const updateSubscription = (plan: 'free' | 'pro') => {
    if (user) {
      const updatedUser = { ...user, subscription: plan };
      setUser(updatedUser);
      localStorage.setItem('mockup_studio_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
