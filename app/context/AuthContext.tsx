"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../lib/api'

type User = {
  _id: string
  googleId: string
  displayName: string
  email: string
  profilePicture: string
  plan: 'basic' | 'premium'
  location?: {
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  purchaseDate?: string
  createdAt: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  refreshUser: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Auth status response:', data);
      
      if (data.user) {
        setUser(data.user);
        if (window.location.search.includes('mobile=true')) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    }
  }

  useEffect(() => {
    const isMobile = /mobile/i.test(window.navigator.userAgent);
    if (isMobile && window.location.search.includes('mobile=true')) {
      // We've returned from mobile auth, check status immediately
      checkAuthStatus();
    } else {
      // Always check auth status on mount for non-mobile or non-redirect cases
      checkAuthStatus();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 