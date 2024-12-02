import React, { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useUserStats } from '../hooks/useUserStats'

interface Location {
  latitude: number
  longitude: number
}

export function Stats() {
  const { stats: data, loading: isLoading } = useUserStats()
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)
    }

    // Clear and add markers only when data changes
    if (data?.visitorLocations) {
      // Clear existing markers
      if (mapRef.current) {
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapRef.current?.removeLayer(layer)
          }
        })

        // Add new markers
        data.visitorLocations.forEach((location: Location) => {
          if (location.latitude && location.longitude) {
            L.marker([location.latitude, location.longitude], {
              icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div class='marker-pin bg-purple-500'></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
              })
            }).addTo(mapRef.current!)
          }
        })
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>
  if (!data) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-2xl font-bold text-purple-600">{data.totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${data.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Map */}
      <div 
        ref={mapContainerRef} 
        className="h-[400px] bg-gray-100 rounded-lg shadow"
      />
    </div>
  )
} 