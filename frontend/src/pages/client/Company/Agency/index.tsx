import { useParams } from "react-router-dom"
import styles from "@/styles/CompanyClient.module.css"
import { Ratings } from "@/components/ratings"
import { useTranslation } from "react-i18next"
import { ServiceList } from "./service-list"
import { InstructorsList } from "./instructors-list"
import { useFetchAgencyById } from "@/services/agency.service"
import { MultipleAgenciesMap } from "@/components/maps/multiple-agencies-map"
import { buildAgencyMarkers } from "@/components/maps/utils"
import { Rating } from "react-simple-star-rating"
import { Spinner } from "@/components/loader/Spinner"

function AgencyClient() {
  const { agencyId } = useParams()
  const { t } = useTranslation()

  const agencyRequest = useFetchAgencyById(agencyId)

  if (agencyRequest.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (agencyRequest.status === "loading") {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  const totalRatings = agencyRequest.data?.sessions?.reduce((acc, session) => {
    if (session.ratingService) {
      return acc + session.ratingService.rating
    }
    return acc
  }, 0)
  const totalSessions = agencyRequest.data.sessions?.filter((session) => session.ratingService).length
  const averageRating = () => (totalRatings && totalSessions ? totalRatings / totalSessions : 0)

  return (
    <div className="flex flex-col gap-[50px] mt-[60px] mb-[83px]">
      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        <h1 className="text-[64px] font-bold ">{agencyRequest.data.name}</h1>
        <div className="flex items-center gap-1">
          <p>{averageRating()}</p>
          <Rating iconsCount={5} size={25} SVGclassName="inline-block" initialValue={averageRating()} readonly={true} />
          <p>
            {totalSessions} {t("agencyClient.ratings")}
          </p>
        </div>
        <p>{agencyRequest.data.description}</p>
      </section>
      <section id={styles.section2} className="pt-[40px] pb-[60px] bg-secondary">
        <div className="w-[80%] mx-auto md:w-full md:mx-0">
          <h2 className="text-[32px] font-bold">{t("agencyClient.gallery")}</h2>
          <div className="flex gap-[20px] mt-[17px]">
            <div className="w-[480px] h-[270px] bg-background"></div>
            <div className="w-[480px] h-[270px] bg-background"></div>
          </div>
        </div>
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        <ServiceList services={agencyRequest.data.services ?? []} />
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex flex-col gap-[17px]">
        <h2 className="text-[32px] font-bold">{t("agencyClient.location")}</h2>
        <div className="flex gap-[5px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="23" viewBox="0 0 15 23" fill="none">
            <path
              d="M0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 8.67196 14.2124 9.77529 13.7043 10.7447L7.5 20.0956L1.29569 10.7447C0.787611 9.77529 0.5 8.67196 0.5 7.5Z"
              stroke="#333333"
            />
            <circle cx="7.5" cy="7.5" r="3" stroke="#333333" />
          </svg>
          <p className="underline">
            {agencyRequest.data.address}, {agencyRequest.data.zip} {agencyRequest.data.city}
          </p>
        </div>
        <div className="h-[530px] bg-secondary rounded-[8px]">
          {agencyRequest.data && (
            <MultipleAgenciesMap markersWIthCoordinates={buildAgencyMarkers([agencyRequest.data])} />
          )}
        </div>
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex flex-col gap-[17px]">
        <h2 className="text-[32px] font-bold">{t("agencyClient.ourInstructors")}</h2>
        {agencyRequest.data.users && <InstructorsList instructors={agencyRequest.data.users} />}
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        <Ratings ratings={agencyRequest.data} />
      </section>
    </div>
  )
}

export default AgencyClient
