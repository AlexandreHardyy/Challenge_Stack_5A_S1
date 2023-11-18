import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import ConfirmationModal from "./modal"
import { Service } from "@/utils/types"

// TODO: Remove after employees implementation
const BEGINNING_HOUR = 8
const BEGINNING_MINUTE = 0
const END_HOUR = 18
const END_MINUTE = 0

interface CalendarProps {
  service: Service
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
  let splittedDayByInterval = []

  while (dayIndex.diff(endOfWeek).toMillis() <= 0) {
    splittedDayByInterval.push(dayIndex)
    dayIndex = dayIndex.plus({ minute: granularity })

    if (dayIndex.diff(endOfDay).toMillis() > 0) {
      calendarValues.push({
        weekday: dayIndex,
        splittedDayByInterval,
      })
      splittedDayByInterval = []
      dayIndex = dayIndex.plus({ day: 1 }).set({ hour: BEGINNING_HOUR, minute: BEGINNING_MINUTE })
      endOfDay = dayIndex.set({ hour: END_HOUR, minute: END_MINUTE })
    }
  }

  return calendarValues
}

export default function Calendar(props: CalendarProps) {
  const { service } = props
  const granularity = service.duration

  const [weekRange, setWeekRange] = useState({
    beginningOfTheWeek: DateTime.now().startOf("day"),
    endOfTheWeek: DateTime.now().plus({ day: 6 }).startOf("day"),
  })
  const [calendarValues, setCalendarValues] = useState(computeCalendarHours(weekRange, granularity))
  const [hourSelected, setHourSelected] = useState<DateTime>(DateTime.now())
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  function onHourSelected(datetime: DateTime) {
    setHourSelected(datetime)
    setIsModalOpen(true)
  }

  useEffect(() => {
    setCalendarValues(computeCalendarHours(weekRange, granularity))
  }, [weekRange, granularity])

  return (
    <>
      <ConfirmationModal
        service={service}
        hourSelected={hourSelected}
        isModalOpen={isModalOpen}
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
          {calendarValues.map((day) => {
            return (
              <div key={day.weekday.weekdayShort} className="flex flex-col gap-4">
                <div className="text-center">
                  <p>{day.weekday.weekdayLong}</p>
                  <p>
                    {day.weekday.day} {day.weekday.monthShort}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {day.splittedDayByInterval.map((hour) => {
                    return (
                      <Button key={hour.toMillis()} size="sm" onClick={() => onHourSelected(hour)}>
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
