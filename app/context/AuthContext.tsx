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
    console.log('Checking auth status...')
    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      console.log('Auth status response:', data)
      
      if (data.user) {
        console.log('Setting user in context:', data.user._id)
        setUser(data.user)
      } else {
        console.log('No user found in response, setting null')
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    console.log('Refreshing user...')
    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      console.log('Refresh user response:', data)
      
      if (data.user) {
        console.log('Setting refreshed user:', data.user._id)
        setUser(data.user)
      } else {
        console.log('No user found in refresh, setting null')
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
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