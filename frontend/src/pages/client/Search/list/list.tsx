import { useFetchAgencies, useFetchCompanies } from "@/services"
import CompanyCard from "./company-card"
import AgencyCard from "./agency-card"
import { Agency, Company } from "@/utils/types"
import { useSearchFiltersContext } from "../search-filters-context"

function buildCards(companiesData?: Company[], agenciesData?: Agency[]) {
  const cards = []

  if (companiesData) {
    cards.push(...companiesData.map((company) => <CompanyCard company={company} key={company.id} />))
  }

  if (agenciesData) {
    cards.push(...agenciesData.map((agency) => <AgencyCard agency={agency} key={agency.id} />))
  }

  return cards
}

function CompaniesAgenciesList() {
  const { filters } = useSearchFiltersContext()

  const {
    data: companiesData,
    status: companiesDataStatus,
    isFetching: isFetchingCompaniesData,
  } = useFetchCompanies(
    {
      socialReason: filters?.name,
      "categories.name": filters?.category,
    },
    true
  )
  const {
    data: agenciesData,
    status: agenciesDataStatus,
    isFetching: isFetchingAgenciesData,
  } = useFetchAgencies(
    {
      name: filters?.name,
      "services.category.name": filters?.category,
      address: filters?.address,
      city: filters?.city,
      zip: filters?.zip,
    },
    true
  )

  const isRequestSended =
    companiesDataStatus === "loading" &&
    agenciesDataStatus === "loading" &&
    !isFetchingCompaniesData &&
    !isFetchingAgenciesData
  const isLoading = isFetchingCompaniesData || isFetchingAgenciesData
  const isError = companiesDataStatus === "error" || agenciesDataStatus === "error"

  return (
    <section className="flex flex-col gap-2">
      {(isRequestSended || (companiesData?.length === 0 && agenciesData?.length === 0)) && <p>No data</p>}
      {isLoading && <p>Loading...</p>}
      {isError && <p>An error occured</p>}
      {(companiesData || agenciesData) && !isLoading && buildCards(companiesData, agenciesData)}
    </section>
  )
}

export default CompaniesAgenciesList
