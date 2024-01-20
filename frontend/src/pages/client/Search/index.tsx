import { useState } from "react"
import SearchForm from "./search-form"
import CompaniesAgenciesList from "./list/list"

export type searchFilters = {
  name?: string,
  category?: string,
  address?: string,
  city?: string,
  zip?: string
}

function Search () {
  const [ filters, setFilters ] = useState<searchFilters>({})

  console.log(filters)

  return (
    <div>
      <SearchForm setFilters={setFilters} />
      <CompaniesAgenciesList filters={filters} />
    </div>
  )
}

export default Search