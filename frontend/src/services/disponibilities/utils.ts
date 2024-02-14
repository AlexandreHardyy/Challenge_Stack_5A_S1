import { BEGINNING_HOUR, BEGINNING_MINUTE, END_HOUR, END_MINUTE } from "@/utils/helpers"
import { DateTime } from "luxon"

export type WeekRange = {
  beginningOfTheWeek: DateTime
  endOfTheWeek: DateTime
}

export function computeCalendarHours(weekRange: WeekRange, granularity: number) {
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
