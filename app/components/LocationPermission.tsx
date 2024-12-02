"use client"
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../lib/api'

export function LocationPermission() {
  const { user } = useAuth()

  const saveUserLocation = async (position: GeolocationPosition) => {
    try {
      const response = await fetch(`${API_URL}/update-location`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update location')
      }
    } catch (error) {
      // Silent fail in production
    }
  }

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        async (position) => {
          await saveUserLocation(position)
        },
        // Error callback
        () => {
          // Silent fail in production
        },
        // Options
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      )
    }
  }

  useEffect(() => {
    if (user) {
      requestLocationPermission()
    }
  }, [user])

  return null
} 