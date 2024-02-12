import { useState } from "react"
import { DateTime } from "luxon"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { DateRangePickerCustom } from "@/components/ui/date-range-picker-custom.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Loader } from "@/components/ui/loader.tsx"
import { Euro, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import CardStatistics from "@/pages/admin/Dashboard/CardStatistics.tsx"
import Overview from "@/pages/admin/Dashboard/overview.tsx"
import { Agency, Company, Session } from "@/utils/types.ts"
import {
  calculateMostSoldAgency,
  calculateOverviewDataByCompanies,
  calculateTotalRevenueByCompanies,
} from "@/utils/kpi.ts"
import { useFetchCompanies } from "@/services/company.service.ts"
import YourAgencies from "@/pages/admin/Dashboard/your-agencies.tsx"

const COMPANIES_ALL: string = "AllCompanies"

const DashboardProvider = () => {
  const { t } = useTranslation()
  const [selectedCompany, setSelectedAgency] = useState(COMPANIES_ALL)
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  })

  const companiesRequest = useFetchCompanies()
  const companies: Company[] | null = companiesRequest.status === "success" ? companiesRequest.data : []

  const agenciesNumber = companies
    ? selectedCompany === COMPANIES_ALL
      ? companies.reduce((acc, company) => acc + company.agencies.length, 0)
      : companies.find((company) => company.socialReason === selectedCompany)?.agencies.length ?? 0
    : 0

  const totalEmployeesNumber = companies.reduce((acc, company: Company) => {
    return (
      acc +
      company.agencies.reduce((acc, agency: Agency) => {
        if (agency.users) {
          return acc + agency.users.length
        }
        return acc
      }, 0)
    )
  }, 0)

  const allSessions: Session[] = []

  if (companies) {
    companies.forEach((company: Company) => {
      if (company.agencies) {
        company.agencies.forEach((agency: Agency) => {
          if (agency.sessions) {
            allSessions.push(...agency.sessions)
          }
        })
      }
    })
  }

  const totalCompaniesRevenue = calculateTotalRevenueByCompanies(
    allSessions,
    (session: Session) => DateTime.fromISO(session.endDate) < DateTime.fromJSDate(new Date()),
    selectedCompany
  )

  const totalCompaniesRevenueRange = calculateTotalRevenueByCompanies(
    allSessions,
    (session: Session) =>
      DateTime.fromISO(session.startDate) >= DateTime.fromJSDate(selectedDateRange.from) &&
      DateTime.fromISO(session.endDate) <= DateTime.fromJSDate(selectedDateRange.to),
    selectedCompany
  )

  const totalEmployeesNumberByAgencyInDateRange = companies
    ? selectedCompany === COMPANIES_ALL
      ? companies.reduce((acc, company) => {
          return (
            acc +
            company.agencies.reduce((acc, agency) => {
              if (agency.users) {
                return acc + agency.users.length
              }
              return acc
            }, 0)
          )
        }, 0)
      : companies
          .find((company) => company.socialReason === selectedCompany)
          ?.agencies.reduce((acc, agency) => {
            if (agency.users) {
              return acc + agency.users.length
            }
            return acc
          }, 0) ?? 0
    : 0

  const mostSoldAgency = calculateMostSoldAgency(companies, selectedDateRange)

  const overviewData = calculateOverviewDataByCompanies(companies)

  return (
    <div className="md:flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Select defaultValue={COMPANIES_ALL} onValueChange={(value) => setSelectedAgency(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("admin.dashboard.selectCompanyPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {companiesRequest.isLoading ? (
                <Loader />
              ) : (
                <>
                  <SelectItem value={COMPANIES_ALL}>{t("admin.dashboard.selectCompanyAll")}</SelectItem>
                  {companies?.map((company: Company) => (
                    <SelectItem key={company.id} value={company.socialReason}>
                      {company.socialReason}
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
            title={t("provider.dashboard.cards.totalRevenue.title")}
            titleNumber={totalCompaniesRevenueRange}
            subtitleNumber={totalCompaniesRevenue}
            subtitleLibelle={t("provider.dashboard.cards.totalRevenue.subtitle")}
            icon={<Euro size={16} className="text-muted-foreground" />}
            isLoading={companiesRequest.isLoading}
          />
          <CardStatistics
            title={t("admin.dashboard.cards.totalEmployees.title")}
            titleNumber={totalEmployeesNumberByAgencyInDateRange}
            subtitleNumber={totalEmployeesNumber}
            subtitleLibelle={t("admin.dashboard.cards.totalEmployees.subtitle")}
            icon={<Users size={16} className="text-muted-foreground" />}
            isLoading={companiesRequest.isLoading}
          />
          {/*<CardStatistics*/}
          {/*  title={t("admin.dashboard.cards.sessionsNumber.title")}*/}
          {/*  titleNumber={numberOfSessionsInDateRangeByCompany}*/}
          {/*  subtitleNumber={numberOfSessionsByCompany}*/}
          {/*  subtitleLibelle={t("admin.dashboard.cards.sessionsNumber.subtitle")}*/}
          {/*  icon={<CalendarCheck size={16} className="text-muted-foreground" />}*/}
          {/*  isLoading={companiesRequest.isLoading}*/}
          {/*/>*/}
          {/*<CardStatistics*/}
          {/*  title={t("admin.dashboard.cards.sessionsHours.title")}*/}
          {/*  titleNumber={totalSessionsHours}*/}
          {/*  subtitleNumber={totalPastSessionsHours}*/}
          {/*  subtitleLibelle={t("admin.dashboard.cards.sessionsHours.subtitle")}*/}
          {/*  icon={<CalendarClock size={16} className="text-muted-foreground" />}*/}
          {/*  isLoading={companiesRequest.isLoading}*/}
          {/*/>*/}
          {/*<CardStatistics*/}
          {/*  title={t("admin.dashboard.cards.sessionsStudents.title")}*/}
          {/*  titleNumber={totalSessionsStudents}*/}
          {/*  subtitleNumber={totalPastSessionsStudents}*/}
          {/*  subtitleLibelle={t("admin.dashboard.cards.sessionsStudents.subtitle")}*/}
          {/*  icon={<Users size={16} className="text-muted-foreground" />}*/}
          {/*  isLoading={companiesRequest.isLoading}*/}
          {/*/>*/}
        </div>
        <div className="grid gap-4 grid-cols-10 lg:grid-cols-2">
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle>{t("admin.dashboard.revenueOverview")}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={overviewData} isLoading={companiesRequest.isLoading} />
            </CardContent>
          </Card>
          <Card className="col-span-4 overflow-auto">
            {companiesRequest.isLoading ? (
              <Loader />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>{t("admin.dashboard.yourAgencies.title")}</CardTitle>
                  <CardDescription>
                    {t("admin.dashboard.yourAgencies.subtitle", { count: agenciesNumber })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {companies && companies.length > 0 ? (
                    <YourAgencies
                      companies={companies}
                      selectedCompany={selectedCompany}
                      mostSoldAgency={mostSoldAgency}
                      companiesRequest={companiesRequest}
                      areCompaniesLoading={companiesRequest.isLoading}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">{t("admin.dashboard.yourAgencies.noServices")}</p>
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
