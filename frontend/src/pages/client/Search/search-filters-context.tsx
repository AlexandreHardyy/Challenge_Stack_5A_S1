import { createContext, useContext, useState } from "react"

export type SearchFilters = {
  name?: string
  category?: string
  address?: string
  city?: string
  zip?: string
}

type Context = {
  filters: SearchFilters

  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>
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
  const [filters, setFilters] = useState<SearchFilters>({})

  return <SearchFiltersContext.Provider {...props} value={{ filters, setFilters }} />
}
