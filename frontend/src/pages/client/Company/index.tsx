import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import styles from "@/styles/CompanyClient.module.css"
import { AgencyList } from "./driving-school-list"
import { Company } from "@/utils/types"
import { Ratings } from "@/components/ratings"
import { useTranslation } from "react-i18next"

function CompanyClient() {
  const { companyId } = useParams()
  const { t } = useTranslation()

  const url = `${import.meta.env.VITE_API_URL}companies/${companyId}`
  const request = useQuery<Company>(
    ["getCompany", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getCompany)")
      }

      return response.json()
    },
    {
      retry: false,
    }
  )

  if (request.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  return (
    <div className="flex flex-col gap-[37px] mt-[60px] mb-[83px] text-grey-dark">
      <section className="flex justify-between w-[80%] mx-auto gap-[226px] md:w-full md:mx-0">
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-[64px] font-bold ">{request.data?.name}</h1>
            <p className="font-semibold ">{t("companyClient.section1.overallRating")}</p>
            <div className="flex items-center gap-1">
              <p>4,5</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                  fill="#1AB34C"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                  fill="#1AB34C"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                  fill="#1AB34C"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                  fill="#1AB34C"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                  fill="#E4E4E7"
                />
              </svg>
              <p>205 {t("companyClient.section1.ratings")}</p>
            </div>
            <p>{request.data?.description}</p>
          </div>
        </div>
        <img
          alt="companylogo"
          className="rounded-[185px] w-[185px] h-[185px]"
          src="https://www.autoecole-du-griffe.fr/images/logo_auto-ecole_griffe__large.png"
        />
      </section>

      <section id={styles.section2} className="pt-[73px] pb-[94px] bg-secondary">
        <div className="w-[80%] flex flex-col mx-auto gap-[17px] md:w-full md:mx-0">
          <h2 className="text-[32px] font-bold">{t("companyClient.section2.ourDrivingSchools")}</h2>
          <div className="flex flex-col gap-[20px]">
            <div className="flex gap-[20px]">
              <Input
                placeholder={t("companyClient.section2.searchBarPlaceholder")}
                className="w-[42%] h-[40px] border-grey-dark p-[9px] rounded-[8px]"
              />
              <Button className="bg-primary">{t("companyClient.section2.researchCta")}</Button>
            </div>
            <div className="flex gap-[20px]">
              <AgencyList agencies={request.data?.agencies} />
              <div className="bg-background grow"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        <Ratings />
      </section>
    </div>
  )
}

export default CompanyClient
