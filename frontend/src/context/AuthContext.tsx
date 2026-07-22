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
  updateProfile: (name: string, photoUrl: string) => Promise<void>;
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
        const localToken = localStorage.getItem('token');
        const localUserStr = localStorage.getItem('user');
        
        if (localToken === 'mock_token_123456' && localUserStr) {
          setToken(localToken);
          setUser(JSON.parse(localUserStr));
          setLoading(false);
          return;
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
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

    // Bypass check: If email matches default sandbox users and password matches 'treefund123'
    if (password === 'treefund123' && (email === 'supporter@gmail.com' || email === 'creater@gmail.com' || email === 'admin@gmail.com')) {
      let role: 'Supporter' | 'Creator' | 'Admin' = 'Supporter';
      let name = 'S.M. Hasan';
      let credits = 450;
      
      if (email === 'creater@gmail.com') {
        role = 'Creator';
        name = 'Green Creator';
        credits = 500;
      } else if (email === 'admin@gmail.com') {
        role = 'Admin';
        name = 'System Administrator';
        credits = 99999;
      }

      const mockUser = {
        id: `mock_${role.toLowerCase()}`,
        name,
        email,
        role,
        credits,
        photoUrl: ''
      };

      localStorage.setItem('token', 'mock_token_123456');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken('mock_token_123456');
      setUser(mockUser);
      setLoading(false);
      router.push('/dashboard');
      return;
    }

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
        role,
        credits: role === 'Supporter' ? 50 : 20,
        photoUrl
      } as any);
      
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
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);
      if (token === 'mock_token_123456') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  const refreshProfile = async () => {
    if (token === 'mock_token_123456') {
      return; // Skip server request for local mock session bypass
    }
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

  const updateProfile = async (name: string, photoUrl: string) => {
    if (token === 'mock_token_123456' && user) {
      const updatedUser = { ...user, name, photoUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return;
    }

    try {
      const res = await authClient.updateUser({
        name,
        image: photoUrl
      });
      if (res.error) {
        throw new Error(res.error.message || 'Failed to update profile.');
      }
      await refreshProfile();
    } catch (err: any) {
      throw new Error(err.message || 'Error updating profile.');
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
        updateProfile,
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
