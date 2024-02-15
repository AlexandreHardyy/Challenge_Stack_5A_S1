import api from "@/utils/api"
import { Agency, Disponibility, ScheduleDisponibilties, Service } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"
import { WeekRange, computeCalendarHours } from "./utils"
import { DateTime } from "luxon"

type computeSessionsByDisponibilitiesParams = {
  disponibilities: Disponibility[]
  service: Service
  weekRange: WeekRange
}

function checkIsSessionNotAvailable(
  sessionStart: DateTime,
  sessionEnd: DateTime,
  exeptions: {
    start: DateTime
    end: DateTime
  }[]
) {
  return exeptions.some((exeption) => {
    if (exeption.end <= sessionStart) return false
    if (exeption.start >= sessionEnd) return false

    return true
  })
}

function checkIsSessionInSchedules(sessionStart: DateTime, sessionEnd: DateTime, schedules: ScheduleDisponibilties[]) {
  return schedules.some((schedule) => {
    const scheduleDate = DateTime.fromISO(schedule.date)
    const startHour = scheduleDate.set({ hour: schedule.startHour })
    const endHour = scheduleDate.set({ hour: schedule.endHour })

    if (schedule.scheduleExceptions.length > 0) {
      if (
        checkIsSessionNotAvailable(
          sessionStart,
          sessionEnd,
          schedule.scheduleExceptions.map((scheduleException) => {
            return {
              start: scheduleDate.set({ hour: scheduleException.startHour }),
              end: scheduleDate.set({ hour: scheduleException.endHour }),
            }
          })
        )
      ) {
        return false
      }
    }

    return sessionStart >= startHour && sessionEnd <= endHour
  })
}

export function computeSessionsByDisponibilities({
  disponibilities,
  service,
  weekRange,
}: computeSessionsByDisponibilitiesParams) {
  const calendarDaysSplitedByGranularity = computeCalendarHours(weekRange, service.duration)

  return calendarDaysSplitedByGranularity.map(({ weekday, splitDayByInterval }) => {
    return {
      weekday,
      sessions: splitDayByInterval.map((start) => {
        const end = start.plus({ minute: service.duration })

        return {
          hour: start,
          status: disponibilities.reduce((acc: string, disponibility) => {
            if (acc === "opened") return acc
            if (checkIsSessionInSchedules(start, end, disponibility.schedules)) acc = "opened"
            return acc
          }, "closed"),
          // workingInstructors: disponibilities.reduce((acc: number[], disponibility) => {
          //   if (checkIsSessionInSchedules(start, end, disponibility.schedules)) {
          //     acc.push(disponibility.userId)
          //   }
          //   return acc
          // }, []),
          instructorsAvailable: disponibilities.reduce((acc: number[], disponibility) => {
            const formattedAlreadyExistingSessions = disponibility.sessions.map((session) => {
              return {
                start: DateTime.fromISO(session.startDate),
                end: DateTime.fromISO(session.endDate),
              }
            })

            if (!checkIsSessionInSchedules(start, end, disponibility.schedules)) return acc

            if (!checkIsSessionNotAvailable(start, end, formattedAlreadyExistingSessions)) {
              acc.push(disponibility.userId)
            }
            return acc
          }, []),
        }
      }),
    }
  })
}

type UseFetchDisponibilitiesParams = {
  agency: Agency
  queryParams?: {
    startDate: string
    endDate: string
  }
}

export function useFetchDisponibilities({ agency, queryParams }: UseFetchDisponibilitiesParams) {
  let url = `agencies/${agency.id}/disponibilities`

  if (queryParams) {
    url = url + `?${new URLSearchParams(queryParams)}`
  }

  return useQuery<Disponibility[]>(
    ["getDisponibilities", url],
    async () => {
      const response = await api.get(url)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getDisponibilities)")
      }

      return response.data["hydra:member"]
    },
    {
      retry: false,
    }
  )
}
