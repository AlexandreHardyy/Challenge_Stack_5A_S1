import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Session, Student } from "@/utils/types"
import { useEffect } from "react"

type StudentCalendarProps = {
  setSelectedSession: (session?: Session) => void
  student: Student
}

function StudentCalendar({ setSelectedSession, student }: StudentCalendarProps) {
  const sessionEvents =
    student.studentSessions?.map((studentSession) => {
      return {
        title: `${studentSession.service.name} ${studentSession.instructor.firstname} ${studentSession.instructor.lastname}`,
        start: studentSession.startDate,
        end: studentSession.endDate,
        session: studentSession,
        backgroundColor: studentSession.status === "cancelled" ? "#ef4444" : "#1AB24C",
      }
    }) ?? []

  const events = [...sessionEvents]

  useEffect(() => {
    setSelectedSession(undefined)
  }, [student])

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

export default StudentCalendar
