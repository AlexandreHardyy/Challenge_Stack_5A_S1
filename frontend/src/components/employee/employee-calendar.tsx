import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Employee, Session } from "@/utils/types"
import { useTranslation } from "react-i18next"

type EmployeeCalendarProps = {
  setSelectedSession: (session: Session) => void
  instructor: Employee
}

function EmployeeCalendar({ setSelectedSession, instructor }: EmployeeCalendarProps) {
  const { t } = useTranslation()

  const sessionEvents =
    instructor.instructorSessions?.map((instructorSession) => {
      return {
        title: `${instructorSession.service.name} ${instructorSession.student.firstname} ${instructorSession.student.lastname}`,
        start: instructorSession.startDate,
        end: instructorSession.endDate,
        session: instructorSession,
        backgroundColor: instructorSession.status === "cancelled" ? "#ef4444" : "#1AB24C",
      }
    }) ?? []

  const scheduleEvents =
    instructor.schedules?.map((schedule) => {
      return {
        title: `${t("provider.myPlanning.workDay")} ${schedule.startHour}H - ${schedule.endHour}H`,
        start: schedule.date,
        end: schedule.date,
        allDay: true,
      }
    }) ?? []

  console.log(scheduleEvents)

  const events = [...sessionEvents, ...scheduleEvents]

  return (
    <div className="grow">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime={"07:00:00"}
        slotMaxTime={"21:00:00"}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventClick={(info) => {
          const event = info.event
          setSelectedSession(event.extendedProps.session)
        }}
      />
    </div>
  )
}

export default EmployeeCalendar
