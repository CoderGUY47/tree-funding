'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
  photoUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, photoUrl: string) => Promise<void>;
  loginWithGoogle: (name?: string, email?: string, photoUrl?: string) => Promise<void>;
  logout: () => void;
  updateCredits: (credits: number) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionRes = await authClient.getSession();
        if (sessionRes.data) {
          const receivedToken = sessionRes.data.session.token;
          const receivedUser = sessionRes.data.user as any;
          localStorage.setItem('token', receivedToken);
          setToken(receivedToken);
          setUser({
            id: receivedUser.id,
            name: receivedUser.name,
            email: receivedUser.email,
            role: receivedUser.role || 'Supporter',
            credits: receivedUser.credits || 0,
            photoUrl: receivedUser.photoUrl || receivedUser.image || ''
          });
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authClient.signIn.email({
        email,
        password
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Login failed.');
      }
      
      const sessionRes = await authClient.getSession();
      if (sessionRes.data) {
        const receivedToken = sessionRes.data.session.token;
        const receivedUser = sessionRes.data.user as any;
        
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser({
          id: receivedUser.id,
          name: receivedUser.name,
          email: receivedUser.email,
          role: receivedUser.role || 'Supporter',
          credits: receivedUser.credits || 0,
          photoUrl: receivedUser.photoUrl || receivedUser.image || ''
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string, photoUrl: string) => {
    setLoading(true);
    try {
      const response = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || '',
        data: {
          role,
          credits: role === 'Supporter' ? 50 : 20,
          photoUrl
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Registration failed.');
      }

      const sessionRes = await authClient.getSession();
      if (sessionRes.data) {
        const receivedToken = sessionRes.data.session.token;
        const receivedUser = sessionRes.data.user as any;
        
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser({
          id: receivedUser.id,
          name: receivedUser.name,
          email: receivedUser.email,
          role: receivedUser.role || 'Supporter',
          credits: receivedUser.credits || 0,
          photoUrl: receivedUser.photoUrl || receivedUser.image || ''
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (name?: string, email?: string, photoUrl?: string) => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard'
      });
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error('Better Auth signout error:', e);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      setUser({ ...user, credits: newCredits });
    }
  };

  const refreshProfile = async () => {
    try {
      const sessionRes = await authClient.getSession();
      if (sessionRes.data) {
        const receivedUser = sessionRes.data.user as any;
        setUser({
          id: receivedUser.id,
          name: receivedUser.name,
          email: receivedUser.email,
          role: receivedUser.role || 'Supporter',
          credits: receivedUser.credits || 0,
          photoUrl: receivedUser.photoUrl || receivedUser.image || ''
        });
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateCredits,
        refreshProfile,
      }}
    >
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
