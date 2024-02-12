import { useParams } from "react-router-dom"
import styles from "@/styles/CompanyClient.module.css"
import { AgencyList } from "./agency-list"
import { useFetchCompany } from "@/services/company.service"
import { Agency } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import AgencySearchBar from "./agency-search-bar"
import { MultipleAgenciesMap } from "@/components/maps/multiple-agencies-map"
import "./map.css"
import { buildAgencyMarkers } from "@/components/maps/utils"
import { Spinner } from "@/components/loader/Spinner"

import defaultAgencyLogo from "@/assets/img/default-company-logo.svg"

function CompanyClient() {
  const { companyId } = useParams()
  const { t } = useTranslation()
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>()

  const companyRequest = useFetchCompany(parseInt(companyId ?? ""))

  if (companyRequest.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (companyRequest.status === "loading") {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[37px] mt-[60px] mb-[83px]">
      <section className="flex justify-between w-[80%] mx-auto gap-[226px] md:w-full md:mx-0">
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-[64px] font-bold ">{companyRequest.data.socialReason}</h1>
            <p className="font-semibold ">{t("companyClient.section1.overallRating")}</p>
            <p>{companyRequest.data.description}</p>
          </div>
        </div>
        <img
          alt="companylogo"
          className="rounded-[185px] w-[185px] h-[185px]"
          src={
            companyRequest.data.image
              ? `${import.meta.env.VITE_API_URL_PUBLIC}${companyRequest.data.image.contentUrl}`
              : defaultAgencyLogo
          }
        />
      </section>

      <section id={styles.section2} className="pt-[73px] pb-[94px] bg-secondary">
        <div className="w-[80%] flex flex-col mx-auto gap-[17px] md:w-full md:mx-0">
          <h2 className="text-[32px] font-bold">{t("companyClient.section2.ourDrivingSchools")}</h2>
          <div className="flex flex-col gap-[20px]">
            <AgencySearchBar agencies={companyRequest.data.agencies ?? []} setFilteredAgencies={setFilteredAgencies} />
            <div className="flex gap-[20px]">
              <AgencyList agencies={filteredAgencies ?? companyRequest.data.agencies} />
              <div className="bg-background grow rounded-[8px]">
                <MultipleAgenciesMap
                  markersWIthCoordinates={buildAgencyMarkers(
                    companyRequest.data.agencies.map((agency) => {
                      return {
                        ...agency,
                        company: {
                          ...agency.company,
                          id: parseInt(companyId ?? ""),
                        },
                      }
                    })
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CompanyClient
