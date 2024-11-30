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
      console.log('Starting auth status check')
      console.log('Current cookies:', document.cookie)
      
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.json()
      console.log('Auth status full response:', data)
      
      if (data.user) {
        console.log('User authenticated:', data.user.email)
        setUser(data.user)
      } else {
        console.log('No user found in response')
        setUser(null)
      }
    } catch (error) {
      console.error('Detailed auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
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