import { useParams } from "react-router-dom"
import { computeServiceDuration } from "@/utils/helpers"
import Calendar from "./calendar"
import { useFetchAgencyById } from "@/services"
import { InstructorSelect } from "./instructor-select"
import { useState } from "react"
import { useFetchSessionsByAgencyService } from "@/services/sessions.service"
import { useTranslation } from "react-i18next"

export default function ServiceClient() {
  const { agencyId, serviceId } = useParams()
  const { t } = useTranslation()
  const [selectedInstructor, setSelectedInstructor] = useState<string>()

  const requestAgency = useFetchAgencyById(agencyId)
  const requestSessions = useFetchSessionsByAgencyService(agencyId)

  if (requestAgency.status === "error" || requestSessions.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  console.log(requestSessions.data)

  const service = requestAgency.data?.services.find((service) => service.id === parseInt(serviceId!))

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
        {requestAgency.data?.users && (
          <InstructorSelect instructors={requestAgency.data.users} setSelectedInstructor={setSelectedInstructor} />
        )}
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex justify-center">
        {service && requestAgency.data && requestSessions.data && (
          <Calendar
            service={service}
            agency={requestAgency.data}
            existingSessions={
              selectedInstructor
                ? requestSessions.data.filter(
                    (existingSession) => existingSession.instructor.id === parseInt(selectedInstructor)
                  )
                : requestSessions.data
            }
            sessionsReFetch={requestSessions.refetch}
            selectedInstructorId={selectedInstructor}
          />
        )}
      </section>
    </div>
  )
}
