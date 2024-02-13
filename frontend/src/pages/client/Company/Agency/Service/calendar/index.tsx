import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import { useState } from "react"
import ConfirmationModal from "./modal"
import { Agency, Service } from "@/utils/types"
import {
  computeSessionsByDisponibilities,
  useFetchDisponibilities,
} from "@/services/disponibilities/disponibilities.service"
import { Loader2 } from "lucide-react"

interface CalendarProps {
  service: Service
  agency: Agency
  selectedInstructorId?: string
}

export default function Calendar({ service, agency, selectedInstructorId }: CalendarProps) {
  const [weekRange, setWeekRange] = useState({
    beginningOfTheWeek: DateTime.now().startOf("day"),
    endOfTheWeek: DateTime.now().plus({ day: 6 }).startOf("day"),
  })

  const [hourSelected, setHourSelected] = useState<DateTime>(DateTime.now())
  const [chosenInstructorIdForSession, setChosenInstructorIdForSession] = useState<number>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: disponibilities, status: disponibilitiesStatus } = useFetchDisponibilities({ agency })

  if (disponibilitiesStatus === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (disponibilitiesStatus === "loading") {
    return <Loader2 />
  }

  const today = DateTime.now()

  const instructorIds = selectedInstructorId ? [parseInt(selectedInstructorId)] : agency.users!.map((user) => user.id)

  const sessions = computeSessionsByDisponibilities({
    disponibilities: disponibilities.filter(
      (disponibility) => instructorIds?.includes(parseInt(`${disponibility.userId}`))
    ),
    service,
    weekRange,
  })

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

  return (
    <>
      <ConfirmationModal
        service={service}
        hourSelected={hourSelected}
        isModalOpen={isModalOpen}
        agency={agency}
        instructorId={chosenInstructorIdForSession}
        onModalOpenChange={setIsModalOpen}
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
                  {day.sessions.map((session) => {
                    if (session.status === "closed") {
                      return <div key={session.hour.toMillis()} className="h-9 rounded-[8px] px-3 bg-secondary"></div>
                    }

                    const isSessionNotAvailable = session.instructorsAvailable.length === 0

                    return (
                      <Button
                        disabled={isSessionNotAvailable || session.hour < today}
                        key={session.hour.toMillis()}
                        size="sm"
                        onClick={() => onHourSelected(session.hour, session.instructorsAvailable)}
                      >
                        {session.hour.toFormat("HH':'mm")}
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
