import { useAuth } from "@/context/AuthContext"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Employee, Session } from "@/utils/types"
import { useTranslation } from "react-i18next"

function EmployeeCalendar({ setSelectedSession }: { setSelectedSession: (session: Session) => void }) {
  const instructor = useAuth().user as Employee | null
  console.log(instructor)
  const { t } = useTranslation()

  if (!instructor) {
    return <h1>{t("common.search.loading")}</h1>
  }

  const sessionEvents = instructor.instructorSessions.map((instructorSession) => {
    return {
      title: `${instructorSession.service.name} ${instructorSession.student.firstname} ${instructorSession.student.lastname}`,
      start: instructorSession.startDate,
      end: instructorSession.endDate,
      session: instructorSession,
    }
  })

  const scheduleEvents = instructor.schedules.map((schedule) => {
    return {
      title: `Work day ${schedule.startHour}H - ${schedule.endHour}H`,
      start: schedule.date,
      end: schedule.date,
      allDay: true,
    }
  })

  const events = [...sessionEvents, ...scheduleEvents]

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
