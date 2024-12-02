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
    if (!mapContainerRef.current || !data) return

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove()
        }
      })

      // Add new markers
      if (data.visitorLocations) {
        data.visitorLocations.forEach((location: Location) => {
          if (location.latitude && location.longitude) {
            const marker = L.marker([location.latitude, location.longitude], {
              icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div class='marker-pin bg-purple-500'></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })
            })
            marker.addTo(mapRef.current!)
          }
        })
      }
    }

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

      <div 
        ref={mapContainerRef} 
        className="h-[400px] bg-gray-100 rounded-lg shadow"
      />
    </div>
  )
} 