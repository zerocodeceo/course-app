import React, { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { useUserStats } from '../hooks/useUserStats'

// Add type definitions
declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    maxClusterRadius?: number
    spiderfyOnMaxZoom?: boolean
    showCoverageOnHover?: boolean
    iconCreateFunction?: (cluster: MarkerCluster) => L.DivIcon
  }

  interface MarkerCluster {
    getChildCount(): number
  }

  class MarkerClusterGroup extends L.FeatureGroup {
    addLayer(layer: L.Layer): this
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup
}

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
        if (layer instanceof L.MarkerClusterGroup) {
          layer.remove()
        }
      })

      // Create a marker cluster group
      const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount()
          return L.divIcon({
            html: `<div class="bg-purple-500 text-white rounded-full flex items-center justify-center w-8 h-8 font-bold">${count}</div>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(32, 32)
          })
        }
      })

      // Add markers to the cluster group
      if (data.visitorLocations?.length > 0) {
        data.visitorLocations.forEach((location) => {
          const { latitude, longitude } = location.coordinates
          if (typeof latitude === 'number' && typeof longitude === 'number') {
            const marker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div class='w-3 h-3 rounded-full bg-purple-500'></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })
            })
            markers.addLayer(marker)
          }
        })
      }

      mapRef.current.addLayer(markers)
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