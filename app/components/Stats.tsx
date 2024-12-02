import React, { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useUserStats } from '../hooks/useUserStats'

export function Stats() {
  const { stats: data, loading: isLoading } = useUserStats()
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait for the container and data to be ready
    if (!mapContainerRef.current || !data.visitorLocations) return

    // Create map if it doesn't exist
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20, 0], 2)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
      }).addTo(map)
      
      mapRef.current = map
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove()
      }
    })

    // Add new markers
    data.visitorLocations.forEach(location => {
      const { latitude, longitude } = location.coordinates
      
      // Debug log
      console.log('Adding marker:', { latitude, longitude })

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        L.marker([latitude, longitude]).addTo(mapRef.current!)
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [data.visitorLocations])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-[400px] bg-gray-100 rounded-lg shadow animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-2xl font-bold text-purple-600">
            {data.totalMembers.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${data.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div 
        ref={mapContainerRef} 
        className="h-[400px] bg-gray-100 rounded-lg shadow"
      />
    </div>
  )
} 