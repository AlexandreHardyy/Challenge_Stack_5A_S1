import { useAuth } from "@/context/AuthContext"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Session } from "@/utils/types"
import { useTranslation } from "react-i18next"

function EmployeeCalendar({ setSelectedSession }: { setSelectedSession: (session: Session) => void }) {
  const instructor = useAuth().user
  const { t } = useTranslation()

  if (!instructor) {
    return <h1>{t("common.search.loading")}</h1>
  }

  const events = instructor.instructorSessions?.map((instructorSessions) => {
    return {
      title: `${instructorSessions.service.name} ${instructorSessions.student.firstname} ${instructorSessions.student.lastname}`,
      start: instructorSessions.startDate,
      end: instructorSessions.endDate,
      session: instructorSessions,
    }
  })

  return (
    <div className="grow">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={(info) => {
          const event = info.event
          setSelectedSession(event.extendedProps.session)
        }}
      />
    </div>
  )
}

export default EmployeeCalendar
