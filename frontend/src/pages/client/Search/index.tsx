import SearchForm from "./search-form"
import CompaniesAgenciesList from "./list/list"
import { SearchFiltersProvider } from "./search-filters-context"

function Search() {
  return (
    <SearchFiltersProvider>
      <div className="flex mb-10">
        <section className="flex flex-col gap-4 grow px-6">
          <SearchForm />
          <CompaniesAgenciesList />
        </section>
        <section className="w-1/3 bg-secondary h-screen"></section>
      </div>
    </SearchFiltersProvider>
  )
}

export default Search
