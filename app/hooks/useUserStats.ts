"use client"
import { useState, useEffect } from 'react'
import { API_URL } from '../lib/api'

export interface UserStats {
  totalMembers: number
  totalRevenue: number
  totalVisitors: number
  totalPremiumUsers: number
  recentPremiumUsers: Array<{
    profilePicture: string
    displayName: string
  }>
  memberGrowth: {
    labels: string[]
    data: number[]
  }
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
    totalVisitors: 0,
    totalPremiumUsers: 0,
    recentPremiumUsers: [],
    memberGrowth: {
      labels: [],
      data: []
    },
    visitorLocations: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/user-stats`, {
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