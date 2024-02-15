import { useParams } from "react-router-dom"
import { computeServiceDuration } from "@/utils/helpers"
import Calendar from "./calendar"
import { useFetchAgencyById } from "@/services/agency.service"
import { InstructorSelect } from "./instructor-select"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServiceClient() {
  const { agencyId, serviceId } = useParams()
  const { t } = useTranslation()
  const [selectedInstructor, setSelectedInstructor] = useState<string>()

  const { data: agency, status: agencyStatus } = useFetchAgencyById(agencyId)
  // const requestSessions = useFetchSessions({
  //   agency: agencyId,
  //   status: "created",
  //   "startDate[after]": DateTime.now().toISO({ includeOffset: false }) ?? "",
  // })

  if (agencyStatus === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (agencyStatus === "loading") {
    return <Loader2 />
  }

  const service = agency.services.find((service) => service.id === parseInt(serviceId!))

  return (
    <div className="flex flex-col gap-[50px] mt-[60px] mb-[83px]">
      <section className="flex flex-col items-center justify-center gap-2 w-[80%] mx-auto md:w-full md:mx-0">
        {service && (
          <Card className="w-[80%]">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>
                <p>{service.description}</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                <p>{t("serviceClient.duration")}: </p>
                <p>{computeServiceDuration(service.duration)}</p>
              </div>
              <div className="flex gap-1">
                <p>{t("serviceClient.price")}: </p>
                <p>{service.price} €</p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="w-[80%]">
          {agency.users && (
            <InstructorSelect instructors={agency.users} setSelectedInstructor={setSelectedInstructor} />
          )}
        </div>
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex justify-center">
        {service && agency && <Calendar service={service} agency={agency} selectedInstructorId={selectedInstructor} />}
      </section>
    </div>
  )
}
