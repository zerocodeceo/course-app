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
    console.log('🔍 Checking auth status...')
    
    // Check for token in URL on initial load
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        localStorage.setItem('auth_token', token);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.user) {
        console.log('✅ User authenticated:', data.user.email)
        setUser(data.user)
      } else {
        console.log('❌ No user data received')
        localStorage.removeItem('auth_token')
        setUser(null)
      }
    } catch (error) {
      console.error('🚨 Auth status error:', error)
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        return
      }

      const response = await fetch(`${API_URL}/auth/status`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      } else {
        localStorage.removeItem('auth_token')
        setUser(null)
      }
    } catch (error) {
      localStorage.removeItem('auth_token')
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 