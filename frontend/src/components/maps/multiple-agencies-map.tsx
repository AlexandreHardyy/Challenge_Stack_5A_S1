import React from "react"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import "mapbox-gl/dist/mapbox-gl.css"

const DEFAULT_COORDINATES: [number, number] = [2.3483915, 48.8534951]

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

interface MapProps {
  markersWIthCoordinates: {
    marker: React.ReactNode
    coordinates: [number, number]
  }[]
}

export function MultipleAgenciesMap({ markersWIthCoordinates }: MapProps) {
  const mapContainerRef = useRef(document.createElement("div"))

  useEffect(() => {
    const startCoordinates: [number, number] = markersWIthCoordinates[0]
      ? markersWIthCoordinates[0].coordinates
      : DEFAULT_COORDINATES

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: startCoordinates,
      zoom: 10,
    })

    markersWIthCoordinates.forEach((markerWIthCoordinate) => {
      const markerDiv = document.createElement("div")

      createRoot(markerDiv).render(markerWIthCoordinate.marker)

      const longitude = markerWIthCoordinate.coordinates[0]
      const latitude = markerWIthCoordinate.coordinates[1]

      new mapboxgl.Marker(markerDiv).setLngLat([longitude, latitude]).addTo(map)
    })

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    return () => map.remove()
  })

  return <div className="map-container" ref={mapContainerRef} />
}
