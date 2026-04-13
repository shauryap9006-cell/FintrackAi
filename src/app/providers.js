'use client';
 
import { AuthProvider } from '@/context/AuthContext';
 
export function ThemeProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
