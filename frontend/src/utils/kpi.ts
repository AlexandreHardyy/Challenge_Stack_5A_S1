import { Company, Session } from "./types"
import { DateTime } from "luxon"

const AGENCIES_ALL: string = "AllAgencies"
const COMPANIES_ALL: string = "AllCompanies"
type SessionFilterFunction = (session: Session) => boolean

export const filterSessionsByDateRange = (sessions: Session[], from: Date, to: Date) =>
  sessions.filter(
    (session) =>
      DateTime.fromISO(session.startDate) >= DateTime.fromJSDate(from) &&
      DateTime.fromISO(session.endDate) <= DateTime.fromJSDate(to)
  )

export const filterSessionsByAgency = (sessions: Session[], agencyName: string) =>
  sessions.filter((session) => session.agency.name === agencyName)

export const calculateNumberOfSessionsInDateRange = (sessions: Session[], from: Date, to: Date, agencyName: string) =>
  agencyName === AGENCIES_ALL
    ? filterSessionsByDateRange(sessions, from, to).length
    : filterSessionsByAgency(filterSessionsByDateRange(sessions, from, to), agencyName).length

export const calculateTotalRevenue = (sessions: Session[], filterFn: SessionFilterFunction, agencyName: string) =>
  agencyName === AGENCIES_ALL
    ? sessions.reduce((acc, session) => (filterFn(session) ? acc + session.service.price : acc), 0)
    : filterSessionsByAgency(sessions, agencyName).reduce(
        (acc, session) => (filterFn(session) ? acc + session.service.price : acc),
        0
      )

export const calculateTotalRevenueByCompanies = (
  sessions: Session[],
  filterFn: SessionFilterFunction,
  companyName: string
) =>
  companyName === COMPANIES_ALL
    ? sessions.reduce((acc, session) => (filterFn(session) ? acc + session.service.price : acc), 0)
    : filterSessionsByAgency(sessions, companyName).reduce(
        (acc, session) => (filterFn(session) ? acc + session.service.price : acc),
        0
      )

export const calculateTotalSessions = (sessions: Session[], filterFn: SessionFilterFunction, agencyName: string) =>
  agencyName === AGENCIES_ALL
    ? sessions.filter((session) => filterFn(session)).length
    : sessions.filter((session) => session.agency.name === agencyName && filterFn(session)).length

export const calculateMostSoldService = (sessions: Session[], dateRange: { from: Date; to: Date }) => {
  const servicesCount = sessions.reduce(
    (acc, session) => {
      const sessionStartDate = DateTime.fromISO(session.startDate)
      const sessionEndDate = DateTime.fromISO(session.endDate)
      if (
        sessionStartDate >= DateTime.fromJSDate(dateRange.from) &&
        sessionEndDate <= DateTime.fromJSDate(dateRange.to)
      ) {
        const serviceName = session.service.name
        acc[serviceName] = (acc[serviceName] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(servicesCount)
    .sort((a, b) => b[1] - a[1])
    .shift()
}

export const calculateMostSoldAgency = (Companies: Company[], dateRange: { from: Date; to: Date }) => {
  //renvoyer le nom de l'agence qui a fait le plus de sessions dans la période donnée
  const agenciesCount = Companies.reduce(
    (acc, company) => {
      company.agencies.forEach((agency) => {
        console.log(agency)
        const sessions = agency.sessions.filter(
          (session) =>
            DateTime.fromISO(session.startDate) >= DateTime.fromJSDate(dateRange.from) &&
            DateTime.fromISO(session.endDate) <= DateTime.fromJSDate(dateRange.to)
        )
        acc[agency.name] = sessions.length
      })
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(agenciesCount)
    .sort((a, b) => b[1] - a[1])
    .shift()
}

export const calculateTotalHours = (sessions: Session[], filterFn: SessionFilterFunction) =>
  sessions.reduce((acc, session) => (filterFn(session) ? acc + session.service.duration : acc), 0)

export const calculateOverviewData = (sessions: Session[]) =>
  Array.from({ length: 12 }, (_, i) => {
    const month = DateTime.local().minus({ months: i })
    const total = sessions.reduce((acc, session) => {
      const sessionStartDate = DateTime.fromISO(session.startDate)
      const sessionEndDate = DateTime.fromISO(session.endDate)
      if (sessionStartDate >= month.startOf("month") && sessionEndDate <= month.endOf("month")) {
        return acc + session.service.price
      }
      return acc
    }, 0)
    return {
      name: month.toFormat("LLL"),
      total: total,
    }
  }).reverse()

export const calculateOverviewDataByCompanies = (companies: Company[]) =>
  Array.from({ length: 12 }, (_, i) => {
    const month = DateTime.local().minus({ months: i })
    const total = companies.reduce((acc, company) => {
      const companyTotal = company.agencies.reduce((acc, agency) => {
        const agencyTotal = agency.sessions.reduce((acc, session) => {
          const sessionStartDate = DateTime.fromISO(session.startDate)
          const sessionEndDate = DateTime.fromISO(session.endDate)
          if (sessionStartDate >= month.startOf("month") && sessionEndDate <= month.endOf("month")) {
            return acc + session.service.price
          }
          return acc
        }, 0)
        return acc + agencyTotal
      }, 0)
      return acc + companyTotal
    }, 0)
    return {
      name: month.toFormat("LLL"),
      total: total,
    }
  }).reverse()
