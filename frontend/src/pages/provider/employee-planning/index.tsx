import { useState } from "react"
import { ScheduleException } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import EmployeeCalendar from "@/components/planning/employee-planning/employee-calendar"
import { SessionDetails } from "@/components/planning/employee-planning/session-details"
import { ScheduleExceptionsForm } from "./form"
import { useFetchScheduleByUser, useFetchScheduleExceptionsByEmployee } from "@/services/schedule.service"
import { format } from "date-fns"
import { Spinner } from "@/components/loader/Spinner"
import { Separator } from "@/components/ui/separator"
import { t } from "i18next"
import { useFetchUserById } from "@/services/user/user.service"
import { useFetchSessionsByInstructor } from "@/services/sessions.service"

function ScheduleExceptions({
  scheduleExceptions,
  isLoading,
}: {
  scheduleExceptions?: ScheduleException[]
  isLoading: boolean
}) {
  if (isLoading) {
    return <Spinner />
  }
  return (
    <>
      {scheduleExceptions
        ?.filter((scheduleException) => scheduleException.status === "PROCESSING")
        .map((scheduleException) => {
          return (
            <div key={scheduleException.id}>
              <Separator />
              <div className="flex gap-6 py-3">
                <div className="font-bold"> {t("provider.myPlanning.ask")}: </div>
                <div> {format(new Date(String(scheduleException.date)), "LLL dd, y")} </div>
                <div>{scheduleException.startHour}h</div>
                <div>-</div>
                <div>{scheduleException.endHour}h</div>
              </div>
            </div>
          )
        })}
    </>
  )
}

function EmployeePlanning() {
  const [selectedSessionId, setSelectedSessionId] = useState<number>()
  const { user } = useAuth()
  const { isLoading, isFetching } = useFetchUserById(Number(user?.id))

  const scheduleExceptions = useFetchScheduleExceptionsByEmployee(user?.id)
  const sessions = useFetchSessionsByInstructor(user?.id)
  const schedules = useFetchScheduleByUser(user?.id)

  if (isLoading || isFetching || scheduleExceptions.isLoading || sessions.isLoading || schedules.isLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <div className="flex">
        <EmployeeCalendar setSelectedSessionId={setSelectedSessionId} sessions={sessions} schedules={schedules} />
        <SessionDetails sessionId={selectedSessionId} />
      </div>
      <div className="flex flex-col gap-6 pt-10">
        <h1 className="text-3xl"> {t("provider.myPlanning.titleBreak")} </h1>
        <ScheduleExceptionsForm />
        <ScheduleExceptions scheduleExceptions={scheduleExceptions.data} isLoading={scheduleExceptions.isLoading} />
      </div>
    </div>
  )
}

export default EmployeePlanning
