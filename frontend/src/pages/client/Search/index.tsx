import SearchForm from "./search-form"
import CompaniesAgenciesList from "./list/list"
import { SearchFiltersProvider } from "./search-filters-context"
import { useState } from "react"
import { Agency } from "@/utils/types"
import { MultipleAgenciesMap } from "@/components/maps/multiple-agencies-map"
import { buildAgencyMarkers } from "@/components/maps/utils"

function Search() {
  const [agenciesDataForMap, setAgenciesDataForMap] = useState<Agency[]>([])
  return (
    <SearchFiltersProvider>
      <div className="flex mb-10">
        <section className="flex flex-col gap-4 grow px-6">
          <SearchForm />
          <CompaniesAgenciesList setAgenciesDataForMap={setAgenciesDataForMap} />
        </section>
        <section className="w-1/3 bg-secondary h-screen">
          {agenciesDataForMap.length > 0 && (
            <MultipleAgenciesMap markersWIthCoordinates={buildAgencyMarkers(agenciesDataForMap)} />
          )}
        </section>
      </div>
    </SearchFiltersProvider>
  )
}

export default Search
