import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import ConfirmationModal from "./modal"
import { Agency, Service, Session } from "@/utils/types"

// TODO: Remove after employees implementation (compute max beginning hour and max end hour)
const BEGINNING_HOUR = 8
const BEGINNING_MINUTE = 0
const END_HOUR = 18
const END_MINUTE = 0

interface CalendarProps {
  service: Service
  agency: Agency
  existingSessions: Session[]
  selectedInstructorId?: string
  sessionsReFetch: () => void
}

interface WeekRange {
  beginningOfTheWeek: DateTime
  endOfTheWeek: DateTime
}

function computeCalendarHours(weekRange: WeekRange, granularity: number) {
  let dayIndex = weekRange.beginningOfTheWeek.set({ hour: BEGINNING_HOUR, minute: BEGINNING_MINUTE })
  let endOfDay = dayIndex.set({ hour: END_HOUR, minute: END_MINUTE })
  const endOfWeek = weekRange.endOfTheWeek.set({ hour: END_HOUR, minute: END_MINUTE })

  const calendarValues = []
  let splitDayByInterval = []

  while (dayIndex.diff(endOfWeek).toMillis() <= 0) {
    splitDayByInterval.push(dayIndex)
    dayIndex = dayIndex.plus({ minute: granularity })

    if (dayIndex.diff(endOfDay).toMillis() > 0) {
      calendarValues.push({
        weekday: dayIndex,
        splitDayByInterval,
      })
      splitDayByInterval = []
      dayIndex = dayIndex.plus({ day: 1 }).set({ hour: BEGINNING_HOUR, minute: BEGINNING_MINUTE })
      endOfDay = dayIndex.set({ hour: END_HOUR, minute: END_MINUTE })
    }
  }

  return calendarValues
}

function checkIsSessionNotAvailable(sessionStart: DateTime, sessionEnd: DateTime, existingSessions: Session[]) {
  return existingSessions.some((existingSession) => {
    const existingSessionStart = DateTime.fromJSDate(new Date(existingSession.startDate))
    const existingSessionEnd = DateTime.fromJSDate(new Date(existingSession.endDate))
    if (existingSessionEnd <= sessionStart) return false
    if (existingSessionStart >= sessionEnd) return false

    return true
  })
}

function checkNotAvailableSessionByInstructor(
  instructorIds: number[],
  sessionStart: DateTime,
  sessionEnd: DateTime,
  existingSessions: Session[]
) {
  return instructorIds.map((instructorId) => {
    return {
      instructorId,
      notAvailable: checkIsSessionNotAvailable(
        sessionStart,
        sessionEnd,
        existingSessions.filter((existingSession) => existingSession.instructor.id === instructorId)
      ),
    }
  })
}

export default function Calendar({
  service,
  agency,
  selectedInstructorId,
  existingSessions,
  sessionsReFetch,
}: CalendarProps) {
  const granularity = service.duration

  const [weekRange, setWeekRange] = useState({
    beginningOfTheWeek: DateTime.now().startOf("day"),
    endOfTheWeek: DateTime.now().plus({ day: 6 }).startOf("day"),
  })
  const [sessions, setSessions] = useState(computeCalendarHours(weekRange, granularity))
  const [hourSelected, setHourSelected] = useState<DateTime>(DateTime.now())
  const [chosenInstructorIdForSession, setChosenInstructorIdForSession] = useState<number>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const instructorIds = selectedInstructorId ? [parseInt(selectedInstructorId)] : agency.users!.map((user) => user.id)

  function modifyWeekRange(type: "previous" | "next") {
    setWeekRange({
      beginningOfTheWeek:
        type === "next"
          ? weekRange.beginningOfTheWeek.plus({ day: 7 })
          : weekRange.beginningOfTheWeek.minus({ day: 7 }),
      endOfTheWeek:
        type === "next" ? weekRange.endOfTheWeek.plus({ day: 7 }) : weekRange.endOfTheWeek.minus({ day: 7 }),
    })
  }

  function onHourSelected(datetime: DateTime, availableInstructors: number[]) {
    setHourSelected(datetime)
    setChosenInstructorIdForSession(availableInstructors[Math.floor(Math.random() * availableInstructors!.length)])
    setIsModalOpen(true)
  }

  useEffect(() => {
    setSessions(computeCalendarHours(weekRange, granularity))
  }, [weekRange, granularity])

  return (
    <>
      <ConfirmationModal
        service={service}
        hourSelected={hourSelected}
        isModalOpen={isModalOpen}
        agency={agency}
        instructorId={chosenInstructorIdForSession}
        onModalOpenChange={setIsModalOpen}
        sessionsReFetch={sessionsReFetch}
      />
      <div className="flex gap-1">
        <Button
          disabled={weekRange.beginningOfTheWeek.equals(DateTime.now().startOf("day"))}
          size="sm"
          onClick={() => modifyWeekRange("previous")}
        >
          {"<"}
        </Button>
        <div className="flex gap-8">
          {sessions.map((day) => {
            return (
              <div key={day.weekday.weekdayShort} className="flex flex-col gap-4">
                <div className="text-center">
                  <p>{day.weekday.weekdayLong}</p>
                  <p>
                    {day.weekday.day} {day.weekday.monthShort}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {day.splitDayByInterval.map((hour) => {
                    // TODO: remove "!"
                    const notAvailableSessionByInstructor = checkNotAvailableSessionByInstructor(
                      instructorIds,
                      hour,
                      hour.plus({ minute: service.duration }),
                      existingSessions
                    )

                    const isSessionNotAvailable = notAvailableSessionByInstructor.every((item) => item.notAvailable)

                    const availableInstructors = notAvailableSessionByInstructor
                      .filter((item) => !item.notAvailable)
                      .map((item) => item.instructorId)

                    return (
                      <Button
                        disabled={isSessionNotAvailable}
                        key={hour.toMillis()}
                        size="sm"
                        onClick={() => onHourSelected(hour, availableInstructors)}
                      >
                        {hour.toFormat("HH':'mm")}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <Button size="sm" onClick={() => modifyWeekRange("next")}>
          {">"}
        </Button>
      </div>
    </>
  )
}
