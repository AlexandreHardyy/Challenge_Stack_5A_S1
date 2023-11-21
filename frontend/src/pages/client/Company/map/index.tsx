import React from "react"
import mapboxgl from "mapbox-gl"

import { useEffect, useRef } from "react"
import { Agency } from "@/utils/types"
import { createRoot } from "react-dom/client"

import pictoAdresse from "@/assets/img/pictoAdresse.svg"
import "./map.css"
import "mapbox-gl/dist/mapbox-gl.css"

const DEFAULT_COORDINATES: [number, number] = [2.3483915, 48.8534951]

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

interface MapProps {
  agencies: Agency[]
  onClickMarker: (agencyId: number) => void
}

interface MarkerProps {
  agency: Agency
  onClickMarker: (agencyId: number) => void
  children?: React.ReactNode
}

function Marker({ agency, onClickMarker, children }: MarkerProps) {
  return (
    <button onClick={() => onClickMarker(agency.id)}>
      <img src={pictoAdresse} width={20} alt="marker" />
      {children}
    </button>
  )
}

export function Map({ agencies, onClickMarker }: MapProps) {
  const mapContainerRef = useRef(document.createElement("div"))

  useEffect(() => {
    const firstAgency = agencies[0]
    const startCoordinates: [number, number] = firstAgency
      ? [parseFloat(firstAgency.geoloc[0]), parseFloat(firstAgency.geoloc[1])]
      : DEFAULT_COORDINATES

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: startCoordinates,
      zoom: 10,
    })

    agencies.forEach((agency) => {
      const markerDiv = document.createElement("div")

      createRoot(markerDiv).render(<Marker onClickMarker={onClickMarker} agency={agency} />)

      const longitude = parseFloat(agency.geoloc[0])
      const latitude = parseFloat(agency.geoloc[1])

      new mapboxgl.Marker(markerDiv).setLngLat([longitude, latitude]).addTo(map)
    })

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    return () => map.remove()
  })

  console.log("Render")

  return <div className="map-container" ref={mapContainerRef} />
}
