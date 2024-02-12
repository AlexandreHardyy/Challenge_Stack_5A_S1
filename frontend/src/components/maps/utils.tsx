import { Agency } from "@/utils/types"
import AgencyMarker from "./agency-marker"

export function buildAgencyMarkers(agencies: Agency[]) {
  return agencies.map((agency) => {
    const coordinates: [number, number] = [parseFloat(agency.geoloc[0]), parseFloat(agency.geoloc[1])]
    return {
      marker: <AgencyMarker agency={agency} />,
      coordinates,
    }
  })
}
