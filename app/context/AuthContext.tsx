"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../lib/api'
import { getUserLocation } from '../lib/geolocation'

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
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const saveUserLocation = async () => {
    try {
      const location = await getUserLocation()
      
      await fetch(`${API_URL}/auth/location`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      })
    } catch (error) {
      console.error('Error saving location:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
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
          await saveUserLocation()
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 