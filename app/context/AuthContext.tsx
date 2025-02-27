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
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      localStorage.removeItem('authToken')
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
    // Check URL for token parameter on load
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    
    if (token) {
      localStorage.setItem('authToken', token)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 