"use client"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

type WorldMapProps = {
  markers: Array<{
    lat: number
    lng: number
  }>
}

export default function WorldMap({ markers }: WorldMapProps) {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 100
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth={0.5}
              style={{
                default: {
                  fill: "#e2e8f0",
                  outline: "none"
                },
                hover: {
                  fill: "#cbd5e1",
                  outline: "none"
                },
                pressed: {
                  fill: "#94a3b8",
                  outline: "none"
                }
              }}
            />
          ))
        }
      </Geographies>
      {markers.map(({ lat, lng }, index) => (
        <Marker key={index} coordinates={[lng, lat]}>
          <circle r={4} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
        </Marker>
      ))}
    </ComposableMap>
  )
} 