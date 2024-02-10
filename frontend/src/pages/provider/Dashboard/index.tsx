import { useState } from "react"
import { DateTime } from "luxon"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { DateRangePickerCustom } from "@/components/ui/date-range-picker-custom.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Loader } from "@/components/ui/loader.tsx"
import { CalendarCheck, CalendarClock, Euro, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useFetchAgenciesByCompany } from "@/services/agency.service.ts"
import { useAuth } from "@/context/AuthContext.tsx"
import YourServices from "@/pages/provider/Dashboard/your-services.tsx"
import CardStatistics from "@/pages/provider/Dashboard/CardStatistics.tsx"
import Overview from "@/pages/provider/Dashboard/overview.tsx"
import { Agency, Session } from "@/utils/types.ts"
import {
  calculateMostSoldService,
  calculateNumberOfSessionsInDateRange,
  calculateOverviewData,
  calculateTotalHours,
  calculateTotalRevenue,
  filterSessionsByAgency,
  filterSessionsByDateRange,
} from "@/utils/kpi.ts"

const AGENCIES_ALL: string = "AllAgencies"

const DashboardProvider = () => {
  const { t } = useTranslation()
  const [selectedAgency, setSelectedAgency] = useState(AGENCIES_ALL)
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  })

  const { user } = useAuth()

  const agenciesRequest = useFetchAgenciesByCompany(user?.company?.id)
  const agencies: Agency[] | null = agenciesRequest.status === "success" ? agenciesRequest.data : null

  const servicesNumber = agencies
    ? selectedAgency === AGENCIES_ALL
      ? agencies.reduce((acc, agency) => acc + agency.services.length, 0)
      : agencies.find((agency) => agency.name === selectedAgency)?.services.length ?? 0
    : 0

  const sessions =
    agenciesRequest.status === "success" ? agenciesRequest.data.flatMap((agency: Agency) => agency.sessions) : []

  const numberOfSessionsByAgency =
    selectedAgency === AGENCIES_ALL ? sessions.length : filterSessionsByAgency(sessions, selectedAgency).length

  const numberOfSessionsInDateRangeByAgency = calculateNumberOfSessionsInDateRange(
    sessions,
    selectedDateRange.from,
    selectedDateRange.to,
    selectedAgency
  )

  const totalSessionsRevenueRange = calculateTotalRevenue(
    sessions,
    (session: Session) =>
      DateTime.fromISO(session.startDate) >= DateTime.fromJSDate(selectedDateRange.from) &&
      DateTime.fromISO(session.endDate) <= DateTime.fromJSDate(selectedDateRange.to),
    selectedAgency
  )

  const totalPastSessionsRevenue = calculateTotalRevenue(
    sessions,
    (session: Session) => DateTime.fromISO(session.endDate) < DateTime.fromJSDate(new Date()),
    selectedAgency
  )

  const totalPastSessionsHours = calculateTotalHours(
    filterSessionsByDateRange(sessions, new Date(0), new Date()),
    (session) => DateTime.fromISO(session.endDate) < DateTime.fromJSDate(new Date())
  )

  const totalSessionsHours = calculateTotalHours(
    filterSessionsByDateRange(sessions, selectedDateRange.from, selectedDateRange.to),
    () => true
  )

  const totalPastSessionsStudents =
    selectedAgency === AGENCIES_ALL
      ? sessions
          .reduce((acc: number[], session: Session) => {
            const sessionEndDate = DateTime.fromISO(session.endDate)
            if (sessionEndDate < DateTime.fromJSDate(new Date())) {
              const student = session.student.id
              if (!(student in acc)) {
                acc.push(student)
              }
            }
            return acc
          }, [] as number[])
          .splice(0, 1).length
      : filterSessionsByAgency(sessions, selectedAgency)
          .reduce((acc: number[], session: Session) => {
            const sessionEndDate = DateTime.fromISO(session.endDate)
            if (sessionEndDate < DateTime.fromJSDate(new Date())) {
              const student = session.student.id
              if (!(student in acc)) {
                acc.push(student)
              }
            }
            return acc
          }, [] as number[])
          .splice(0, 1).length

  const totalSessionsStudents =
    selectedAgency === AGENCIES_ALL
      ? sessions
          .reduce((acc: number[], session: Session) => {
            const sessionStartDate = DateTime.fromISO(session.startDate)
            const sessionEndDate = DateTime.fromISO(session.endDate)
            if (
              sessionStartDate >= DateTime.fromJSDate(selectedDateRange.from) &&
              sessionEndDate <= DateTime.fromJSDate(selectedDateRange.to)
            ) {
              const student = session.student.id
              if (!(student in acc)) {
                acc.push(student)
              }
            }
            return acc
          }, [] as number[])
          .splice(0, 1).length
      : filterSessionsByAgency(sessions, selectedAgency)
          .reduce((acc: number[], session) => {
            const sessionStartDate = DateTime.fromISO(session.startDate)
            const sessionEndDate = DateTime.fromISO(session.endDate)
            if (
              sessionStartDate >= DateTime.fromJSDate(selectedDateRange.from) &&
              sessionEndDate <= DateTime.fromJSDate(selectedDateRange.to)
            ) {
              const student = session.student.id
              if (!(student in acc)) {
                acc.push(student)
              }
            }
            return acc
          }, [] as number[])
          .splice(0, 1).length

  const mostSoldService = calculateMostSoldService(sessions, selectedDateRange)

  const overviewData = calculateOverviewData(sessions)

  return (
    <div className="md:flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Select defaultValue={AGENCIES_ALL} onValueChange={(value) => setSelectedAgency(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("provider.homeProvider.selectAgencyPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {agenciesRequest.isLoading ? (
                <Loader />
              ) : (
                <>
                  <SelectItem value={AGENCIES_ALL}>{t("provider.homeProvider.selectAgencyAll")}</SelectItem>
                  {agencies?.map((agency: Agency) => (
                    <SelectItem key={agency.id} value={agency.name}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <DateRangePickerCustom
            onUpdate={({ range: values }) => setSelectedDateRange({ from: values.from, to: values.to ?? new Date() })}
            initialDateFrom={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            initialDateTo={new Date()}
            align="start"
            showCompare={false}
          />
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 grid-cols-4 lg:grid-cols-2">
          <CardStatistics
            title={t("provider.homeProvider.cards.totalRevenue.title")}
            titleNumber={totalSessionsRevenueRange}
            subtitleNumber={totalPastSessionsRevenue}
            subtitleLibelle={t("provider.homeProvider.cards.totalRevenue.subtitle")}
            icon={<Euro size={16} className="text-muted-foreground" />}
            isLoading={agenciesRequest.isLoading}
          />
          <CardStatistics
            title={t("provider.homeProvider.cards.sessionsNumber.title")}
            titleNumber={numberOfSessionsInDateRangeByAgency}
            subtitleNumber={numberOfSessionsByAgency}
            subtitleLibelle={t("provider.homeProvider.cards.sessionsNumber.subtitle")}
            icon={<CalendarCheck size={16} className="text-muted-foreground" />}
            isLoading={agenciesRequest.isLoading}
          />
          <CardStatistics
            title={t("provider.homeProvider.cards.sessionsHours.title")}
            titleNumber={totalSessionsHours}
            subtitleNumber={totalPastSessionsHours}
            subtitleLibelle={t("provider.homeProvider.cards.sessionsHours.subtitle")}
            icon={<CalendarClock size={16} className="text-muted-foreground" />}
            isLoading={agenciesRequest.isLoading}
          />
          <CardStatistics
            title={t("provider.homeProvider.cards.sessionsStudents.title")}
            titleNumber={totalSessionsStudents}
            subtitleNumber={totalPastSessionsStudents}
            subtitleLibelle={t("provider.homeProvider.cards.sessionsStudents.subtitle")}
            icon={<Users size={16} className="text-muted-foreground" />}
            isLoading={agenciesRequest.isLoading}
          />
        </div>
        <div className="grid gap-4 grid-cols-10 lg:grid-cols-2">
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle>{t("provider.homeProvider.revenueOverview")}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={overviewData} isLoading={agenciesRequest.isLoading} />
            </CardContent>
          </Card>
          <Card className="col-span-4 overflow-auto">
            {agenciesRequest.isLoading ? (
              <Loader />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>{t("provider.homeProvider.yourServices.title")}</CardTitle>
                  <CardDescription>
                    {t("provider.homeProvider.yourServices.subtitle", { count: servicesNumber })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {agencies && agencies.length > 0 ? (
                    <YourServices
                      agencies={agencies}
                      selectedAgency={selectedAgency}
                      mostSoldService={mostSoldService}
                      agenciesRequest={agenciesRequest}
                      isSessionsLoading={agenciesRequest.isLoading}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">
                        {t("provider.homeProvider.yourServices.noServices")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardProvider
