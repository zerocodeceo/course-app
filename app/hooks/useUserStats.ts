"use client"
import { useState, useEffect } from 'react'

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
        const response = await fetch('http://localhost:8000/user-stats', {
          credentials: 'include'
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