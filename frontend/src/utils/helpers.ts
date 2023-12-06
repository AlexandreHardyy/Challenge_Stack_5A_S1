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
