import { useFetchAgencies } from "@/services/agency.service"
import CompanyCard from "./company-card"
import AgencyCard from "./agency-card"
import { Agency, Company } from "@/utils/types"
import { useSearchFiltersContext } from "../search-filters-context"
import { useTranslation } from "react-i18next"
import { useFetchCompanies } from "@/services/company.service"
import { useEffect } from "react"

type CompaniesAgenciesListProps = {
  setAgenciesDataForMap: (agencies: Agency[]) => void
}

function buildCards(companiesData?: Company[], agenciesData?: Agency[]) {
  const cards = []

  if (companiesData) {
    cards.push(...companiesData.map((company) => <CompanyCard company={company} key={`company-${company.id}`} />))
  }

  if (agenciesData) {
    cards.push(...agenciesData.map((agency) => <AgencyCard agency={agency} key={`agency-${agency.id}`} />))
  }

  return cards
}

function CompaniesAgenciesList({ setAgenciesDataForMap }: CompaniesAgenciesListProps) {
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
      page: `${filters.page}`,
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
      "services.name": filters?.category,
      address: filters?.address,
      city: filters?.city,
      zip: filters?.zip,
      page: `${filters.page}`,
    },
    true
  )

  const isRequestNotSent =
    companiesDataStatus === "loading" &&
    agenciesDataStatus === "loading" &&
    !isFetchingCompaniesData &&
    !isFetchingAgenciesData
  const isLoading = isFetchingCompaniesData || isFetchingAgenciesData
  const isError = companiesDataStatus === "error" || agenciesDataStatus === "error"

  useEffect(() => {
    if (agenciesData && agenciesData.length > 0) setAgenciesDataForMap(agenciesData)
  }, [agenciesData])

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

  if (isRequestNotSent || (companiesData?.length === 0 && agenciesData?.length === 0)) {
    return (
      <section className="flex flex-col gap-2">
        <p>{t("searchClient.list.noData")}</p>
      </section>
    )
  }

  return (
    <section id="search-list" className="flex flex-col gap-2">
      {(companiesData || agenciesData) && buildCards(companiesData, agenciesData)}
    </section>
  )
}

export default CompaniesAgenciesList
