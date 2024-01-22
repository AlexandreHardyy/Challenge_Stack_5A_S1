import { useFetchAgencies, useFetchCompanies } from "@/services"
import CompanyCard from "./company-card"
import AgencyCard from "./agency-card"
import { Agency, Company } from "@/utils/types"
import { useSearchFiltersContext } from "../search-filters-context"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

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

  const isRequestNotSended =
    companiesDataStatus === "loading" &&
    agenciesDataStatus === "loading" &&
    !isFetchingCompaniesData &&
    !isFetchingAgenciesData
  const isLoading = isFetchingCompaniesData || isFetchingAgenciesData
  const isError = companiesDataStatus === "error" || agenciesDataStatus === "error"

  if (isError) {
    return (
      <section className="flex flex-col gap-2">
        <p>{t("searchClient.list.error")}</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="flex flex-col gap-2">
        <p>{t("searchClient.list.loading")}</p>
      </section>
    )
  }

  if (isRequestNotSended || (companiesData?.length === 0 && agenciesData?.length === 0)) {
    return (
      <section className="flex flex-col gap-2">
        <p>{t("searchClient.list.noData")}</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-2">
      {(companiesData || agenciesData) && buildCards(companiesData, agenciesData)}
    </section>
  )
}

export default CompaniesAgenciesList
