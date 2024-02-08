const MINUTES_IN_ONE_HOUR = 60

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

export function formatQueryParams(queryParams?: Record<string, string>) {
  const isQueryParamsDefined = !!(
    queryParams && Object.values(queryParams).find((value) => value !== undefined && value !== "")
  )

  //TODO: add pagination
  if (isQueryParamsDefined) {
    const formatedQueryParams = Object.entries(queryParams)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join("&")

    return `?${formatedQueryParams}`
  }
}
