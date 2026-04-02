import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './supabase';
import { User } from './types';
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('chase_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('chase_user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('chase_user');
    window.location.hash = '#/signin';
  };
  const refreshUser = async () => {
    if (!user) return;
    const { data, error } = await supabase.
    from('users').
    select('*').
    eq('id', user.id).
    single();
    if (data && !error) {
      setUser(data as User);
      localStorage.setItem('chase_user', JSON.stringify(data));
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshUser
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};