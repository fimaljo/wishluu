'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  isUserAdmin,
} from '@/lib/firebase';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: () => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async () => {
    return await signInWithGoogle();
  };

  const signOut = async () => {
    return await signOutUser();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async user => {
      setUser(user);
      setIsAdmin(isUserAdmin(user));
      setIsLoading(false);

      // Upsert user data to Firebase when they sign in
      if (user) {
        try {
          const userData = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            isAdmin: isUserAdmin(user),
          };

          try {
            await apiClient.post('/auth/user', { userData });
          } catch (error) {
            console.warn(
              'Failed to upsert user data - this is normal for new users:',
              error
            );
          }
        } catch (error) {
          console.warn(
            'Error upserting user data - this is normal for new users:',
            error
          );
        }
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isAdmin,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
