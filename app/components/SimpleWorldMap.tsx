"use client"
import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

type SimpleWorldMapProps = {
  markers: Array<{
    lat: number
    lng: number
  }>
}

export default function SimpleWorldMap({ markers }: SimpleWorldMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  }

  return (
    <div className="w-full h-[400px] overflow-hidden">
      <ComposableMap
        projectionConfig={{
          scale: 130,
          center: [0, 0]
        }}
        width={800}
        height={400}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#7c3aed"
                stroke="#9f69ff"
                strokeWidth={0.5}
                style={{
                  default: {
                    fill: "#7c3aed",
                    stroke: "#9f69ff",
                    outline: "none",
                    opacity: 0.8
                  },
                  hover: {
                    fill: "#7c3aed",
                    stroke: "#9f69ff",
                    outline: "none",
                    opacity: 0.8
                  },
                  pressed: {
                    fill: "#7c3aed",
                    stroke: "#9f69ff",
                    outline: "none",
                    opacity: 0.8
                  }
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ lat, lng }, index) => (
          <Marker key={index} coordinates={[lng, lat]}>
            <circle r={4} fill="#22c55e" stroke="white" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
} 