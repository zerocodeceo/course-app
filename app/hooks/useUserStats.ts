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

const initialStats: UserStats = {
  totalMembers: 0,
  totalRevenue: 0,
  visitorLocations: []
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(initialStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard-stats`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats({
          totalMembers: data.totalMembers || 0,
          totalRevenue: data.totalRevenue || 0,
          visitorLocations: data.visitorLocations || []
        })
      } catch (error) {
        setStats(initialStats)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 