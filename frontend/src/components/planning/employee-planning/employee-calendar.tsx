import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Schedule, Session } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { EventInput } from "@fullcalendar/core/index.js"
import { addHours } from "date-fns"
import { UseQueryResult } from "@tanstack/react-query"

type EmployeeCalendarProps = {
  setSelectedSessionId: (sessionId: number) => void
  sessions: UseQueryResult<Session[], unknown>
  schedules: UseQueryResult<Schedule[], unknown>
}

function EmployeeCalendar({ setSelectedSessionId, sessions, schedules }: EmployeeCalendarProps) {
  const { t } = useTranslation()

  if (sessions.isLoading || schedules.isLoading) {
    return <></>
  }

  const sessionEvents =
    sessions.data?.map((instructorSession) => {
      return {
        title: `${instructorSession.service.name} ${instructorSession.student.firstname} ${instructorSession.student.lastname}`,
        start: instructorSession.startDate,
        end: instructorSession.endDate,
        session: instructorSession,
        backgroundColor: instructorSession.status === "cancelled" ? "#ef4444" : "#1AB24C",
      }
    }) ?? []

  const scheduleEvents = schedules.data?.reduce((events: EventInput[], schedule) => {
    events.push({
      title: `${t("provider.myPlanning.workDay")}`,
      start: addHours(new Date(schedule.date), schedule.startHour),
      end: addHours(new Date(schedule.date), schedule.endHour),
      display: "background",
      backgroundColor: "#66a3ff",
      className: "text-white",
    })

    schedule.scheduleExceptions?.forEach((scheduleException) => {
      if (scheduleException.status === "VALIDATED") {
        events.push({
          title: "Break",
          start: addHours(new Date(schedule.date), scheduleException.startHour),
          end: addHours(new Date(schedule.date), scheduleException.endHour),
          backgroundColor: "#9933ff",
        })
      }
    })

    return events
  }, [])

  const events = [...sessionEvents, ...(scheduleEvents ?? [])]

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
          setSelectedSessionId(event.extendedProps.session.id)
        }}
      />
    </div>
  )
}

export default EmployeeCalendar
