"use client"
import { useState, useEffect } from 'react'
import { API_URL } from '../lib/api'

type UserStats = {
  totalPremiumUsers: number
  recentPremiumUsers: Array<{
    profilePicture: string
    displayName: string
  }>
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalPremiumUsers: 0,
    recentPremiumUsers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_URL}/user-stats`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 