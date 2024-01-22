import { createContext, useContext, useState } from "react"

export type searchFilters = {
  name?: string
  category?: string
  address?: string
  city?: string
  zip?: string
}

type Context = {
  filters: searchFilters

  setFilters: React.Dispatch<React.SetStateAction<searchFilters>>
}

const SearchFiltersContext = createContext<Context | undefined>(undefined)

export function useSearchFiltersContext() {
  const searchFiltersContext = useContext(SearchFiltersContext)
  if (searchFiltersContext === undefined) {
    throw new Error("searchFiltersContext must be inside a SearchFiltersProvider")
  }
  return searchFiltersContext
}

export function SearchFiltersProvider(props: React.PropsWithChildren) {
  const [filters, setFilters] = useState<searchFilters>({})

  return <SearchFiltersContext.Provider {...props} value={{ filters, setFilters }} />
}
