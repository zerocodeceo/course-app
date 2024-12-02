"use client"
import { useState, useEffect } from 'react'
import { API_URL } from '../lib/api'

type UserStats = {
  totalMembers: number
  totalRevenue: number
  visitorLocations: Array<{
    coordinates: {
      latitude: number
      longitude: number
    }
  }>
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalMembers: 0,
    totalRevenue: 0,
    visitorLocations: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard-stats`, {
          credentials: 'include'
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        // Silent fail in production
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 