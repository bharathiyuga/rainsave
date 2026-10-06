import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserRole } from '../types';
import { db, subscribeToDB } from '../lib/supabase';

interface AuthContextType {
  user: Profile;
  role: UserRole;
  isAdmin: boolean;
  isSeller: boolean;
  availableUsers: Profile[];
  switchUser: (id: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<Profile>;
  loginWithApple: () => Promise<Profile>;
  signup: (fullName: string, email: string, role: UserRole, phone?: string, location?: string, password?: string) => Promise<Profile>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile>(() => db.getCurrentUser());
  const [availableUsers, setAvailableUsers] = useState<Profile[]>(() => db.getAvailableUsers());

  useEffect(() => {
    const unsubscribe = subscribeToDB(() => {
      setUser(db.getCurrentUser());
      setAvailableUsers(db.getAvailableUsers());
    });
    return unsubscribe;
  }, []);

  const switchUser = (id: string) => {
    const switched = db.switchUser(id);
    setUser(switched);
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Artificial slight delay for realistic auth response
    await new Promise((r) => setTimeout(r, 400));
    const all = db.getAvailableUsers();
    const match = all.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (match) {
      db.setCurrentUser(match);
      setUser(match);
      return true;
    }
    // If not found in seed, create new user profile
    const registered = db.registerUser(email.split('@')[0], email, 'user');
    setUser(registered);
    return true;
  };

  const loginWithGoogle = async (): Promise<Profile> => {
    await new Promise((r) => setTimeout(r, 600));
    const googleEmail = 'bharathiyuga842007@gmail.com';
    const all = db.getAvailableUsers();
    let match = all.find((u) => u.email.toLowerCase() === googleEmail.toLowerCase());
    if (!match) {
      match = db.registerUser(
        'Bharathi Yuga (Google)',
        googleEmail,
        'user',
        '+91 98400 12345',
        'Salem, Tamil Nadu'
      );
    }
    db.setCurrentUser(match);
    setUser(match);
    return match;
  };

  const loginWithApple = async (): Promise<Profile> => {
    await new Promise((r) => setTimeout(r, 600));
    const appleEmail = 'apple.user@icloud.com';
    const all = db.getAvailableUsers();
    let match = all.find((u) => u.email.toLowerCase() === appleEmail.toLowerCase());
    if (!match) {
      match = db.registerUser(
        'Apple Verified User',
        appleEmail,
        'user',
        '+91 98400 54321',
        'Chennai, Tamil Nadu'
      );
    }
    db.setCurrentUser(match);
    setUser(match);
    return match;
  };

  const signup = async (fullName: string, email: string, role: UserRole, phone = '', location = '', _password?: string): Promise<Profile> => {
    await new Promise((r) => setTimeout(r, 400));
    const registered = db.registerUser(fullName, email, role, phone, location);
    setUser(registered);
    return registered;
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  };

  const logout = () => {
    const users = db.getAvailableUsers();
    if (users.length > 0) {
      db.setCurrentUser(users[0]);
      setUser(users[0]);
    }
  };

  const value = {
    user,
    role: user.role,
    isAdmin: user.role === 'admin',
    isSeller: user.role === 'seller' || user.role === 'admin',
    availableUsers,
    switchUser,
    login,
    loginWithGoogle,
    loginWithApple,
    signup,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
