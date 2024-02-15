import { useParams } from "react-router-dom"
import { computeServiceDuration } from "@/utils/helpers"
import Calendar from "./calendar"
import { useFetchAgencyById } from "@/services/agency.service"
import { InstructorSelect } from "./instructor-select"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"

export default function ServiceClient() {
  const { agencyId, serviceId } = useParams()
  const { t } = useTranslation()
  const [selectedInstructor, setSelectedInstructor] = useState<string>()

  const { data: agency, status: agencyStatus } = useFetchAgencyById(agencyId)

  if (agencyStatus === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (agencyStatus === "loading") {
    return <Loader2 />
  }

  const service = agency.services.find((service) => service.id === parseInt(serviceId!))

  return (
    <div className="flex flex-col gap-[50px] mt-[60px] mb-[83px]">
      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        {service && (
          <div>
            <h1>{t("serviceClient.details")}</h1>
            <p>
              {t("serviceClient.title")}: {service.name}
            </p>
            <p>
              {t("serviceClient.duration")}: {computeServiceDuration(service.duration)}
            </p>
            <p>
              {t("serviceClient.price")}: {service.price}
            </p>
            <p>
              {t("serviceClient.description")}: {service.description}
            </p>
          </div>
        )}
        {agency.users && <InstructorSelect instructors={agency.users} setSelectedInstructor={setSelectedInstructor} />}
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex justify-center">
        {service && agency && <Calendar service={service} agency={agency} selectedInstructorId={selectedInstructor} />}
      </section>
    </div>
  )
}
