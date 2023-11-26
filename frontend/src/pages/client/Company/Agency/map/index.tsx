import mapboxgl from "mapbox-gl"
import React from "react"

import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

import pictoAdresse from "@/assets/img/pictoAdresse.svg"
import "./map.css"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function Marker({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      <img src={pictoAdresse} width={20} alt="marker" />
      {children}
    </div>
  )
}

export function Map({ geoloc }: { geoloc: [string, string] }) {
  const mapContainerRef = useRef(document.createElement("div"))

  useEffect(() => {
    const longitude = parseFloat(geoloc[0])
    const latitude = parseFloat(geoloc[1])

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 15,
    })

    const markerDiv = document.createElement("div")

    createRoot(markerDiv).render(<Marker />)

    new mapboxgl.Marker(markerDiv).setLngLat([longitude, latitude]).addTo(map)

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    return () => map.remove()
  })

  return <div className="map-container" ref={mapContainerRef} />
}
