import { DateTime } from "luxon"

const MINUTES_IN_ONE_HOUR = 60

export const BEGINNING_HOUR = 8
export const BEGINNING_MINUTE = 0
export const END_HOUR = 21
export const END_MINUTE = 0

export function computeServiceDuration(duration: number) {
  if (duration < MINUTES_IN_ONE_HOUR) {
    return `${duration}min`
  }

  const durationInHour = duration / MINUTES_IN_ONE_HOUR

  return duration % MINUTES_IN_ONE_HOUR ? `${durationInHour}:${duration % MINUTES_IN_ONE_HOUR}` : `${durationInHour}h`
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR")
}

export function formatDateTime(date: string): string {
  return DateTime.fromISO(date).setLocale("fr").toLocaleString({
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

export function formatQueryParams(queryParams?: Record<string, string | string[]>) {
  const isQueryParamsDefined = !!(
    queryParams && Object.values(queryParams).find((value) => value !== undefined && value !== "")
  )

  if (isQueryParamsDefined) {
    const formatedQueryParams = Object.entries(queryParams)
      .filter(([, value]) => value !== undefined && value !== "" && value.length !== 0)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}=${value}`
        }

        return value.map((subValue) => `${key}=${subValue}`).join("&")
      })
      .join("&")

    return `?${formatedQueryParams}`
  }
}
