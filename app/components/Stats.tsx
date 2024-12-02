import React, { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useUserStats } from '../hooks/useUserStats'

export function Stats() {
  const { stats: data, loading: isLoading } = useUserStats()
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
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
      if (data.visitorLocations?.length > 0) {
        data.visitorLocations.forEach((location) => {
          const { latitude, longitude } = location.coordinates
          if (typeof latitude === 'number' && typeof longitude === 'number') {
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div class='w-3 h-3 rounded-full bg-purple-500'></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })
            }).addTo(mapRef.current!)
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