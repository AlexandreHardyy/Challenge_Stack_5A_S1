import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "@/components/ui/search"
import { DateRangePickerCustom } from "@/components/ui/date-range-picker-custom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview, YourServices } from "@/components/dashboard-provider"
import { useTranslation } from "react-i18next"
import { Company, Agency } from "@/utils/types.ts"
import { useFetchCompany } from "@/services/company.service"
import { useState } from "react"
import { Loader } from "@/components/ui/loader.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { useFetchAgenciesByCompany } from "@/services/agency.service"

const HomeProvider = () => {
  const { t } = useTranslation()
  const [selectedAgency, setSelectedAgency] = useState("AllAgencies")

  const { user } = useAuth()

  const companyRequest = useFetchCompany(user?.company?.id)
  const agenciesRequest = useFetchAgenciesByCompany(user?.company?.id)
  const company: Company | null = companyRequest.status === "success" ? companyRequest.data : null
  const agencies: Agency[] | null = agenciesRequest.status === "success" ? agenciesRequest.data : null

  const servicesNumber = agencies
    ? selectedAgency === "AllAgencies"
      ? agencies.reduce((acc, agency) => acc + agency.services.length, 0)
      : agencies.find((agency) => agency.name === selectedAgency)?.services.length ?? 0
    : 0

  return (
    <div className="md:flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Select defaultValue={"AllAgencies"} onValueChange={(value) => setSelectedAgency(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("provider.homeProvider.selectAgencyPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {companyRequest.isLoading ? (
                <Loader />
              ) : (
                <>
                  <SelectItem value="AllAgencies">{t("provider.homeProvider.selectAgencyAll")}</SelectItem>
                  {company?.agencies.map((agency: Agency) => (
                    <SelectItem key={agency.id} value={agency.name}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <DateRangePickerCustom
            onUpdate={({ range: values }) => console.log(values)}
            initialDateFrom={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            initialDateTo={new Date()}
            align="start"
            showCompare={false}
          />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 grid-cols-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("provider.homeProvider.cards.totalRevenue")}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("provider.homeProvider.cards.subscriptions")}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("provider.homeProvider.cards.sales")}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-10 lg:grid-cols-2">
          <Card className="col-span-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
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
                    <YourServices agencies={agencies} selectedAgency={selectedAgency} />
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

export default HomeProvider
