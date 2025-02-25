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
      })
      
      console.log('Auth status response:', response.status);
      
      if (!response.ok) {
        console.error('Auth status error:', response.status, response.statusText);
        setUser(null);
        setLoading(false);
        return;
      }
      
      const data = await response.json()
      console.log('Auth data received:', data ? 'data present' : 'no data');
      
      if (data.user) {
        console.log('User authenticated:', data.user.displayName);
        setUser(data.user)
      } else {
        console.log('No user data in response');
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        console.error('User refresh error:', response.status, response.statusText);
        setUser(null);
        return;
      }
      
      const data = await response.json()
      console.log('User refresh data:', data ? 'data present' : 'no data');
      
      if (data.user) {
        console.log('User refreshed:', data.user.displayName);
        setUser(data.user)
      } else {
        console.log('No user data in refresh response');
        setUser(null)
      }
    } catch (error) {
      console.error('User refresh error:', error);
      setUser(null)
    }
  }

  useEffect(() => {
    // Log browser information to help with debugging
    const browserInfo = {
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform
    };
    console.log('Browser info:', browserInfo);
    
    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 