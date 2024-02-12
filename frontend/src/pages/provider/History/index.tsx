import { Agency, Service } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/context/AuthContext.tsx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { Loader } from "@/components/ui/loader.tsx"
import { useState } from "react"
import { useFetchAgenciesByCompany } from "@/services/agency.service.ts"
import { Button } from "@/components/ui/button.tsx"
import SessionsHistoryTable from "@/pages/provider/History/SessionsHistoryTable.tsx"

const History = () => {
  const [selectedService, setSelectedService] = useState("AllServices")
  const { t } = useTranslation()

  const user = useAuth().user

  const agenciesRequest = useFetchAgenciesByCompany(user?.company?.id)
  const agencies = agenciesRequest.status === "success" ? agenciesRequest.data : []
  // const sessionsRequest: UseQueryResult<Session[]> = useFetchSessions(agencies?.map((agency) => agency.id.toString()))

  // const agenciesRequest = useFetchAgenciesByCompany(user?.company?.id)
  // const agencies: Agency[] | null = agenciesRequest.status === "success" ? agenciesRequest.data : null
  //
  // const servicesNumber = agencies
  //   ? selectedAgency === AGENCIES_ALL
  //     ? agencies.reduce((acc, agency) => acc + agency.services.length, 0)
  //     : agencies.find((agency) => agency.name === selectedAgency)?.services.length ?? 0
  //   : 0
  //
  // const sessions =
  //   agenciesRequest.status === "success" ? agenciesRequest.data.flatMap((agency: Agency) => agency.sessions) : []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("provider.history.title")}</h1>
      <div className="flex justify-between">
        <Select
          defaultValue={"AllServices"}
          value={selectedService}
          onValueChange={(value) => setSelectedService(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("provider.history.table.placeholder.selectedService")} />
          </SelectTrigger>
          <SelectContent>
            {agenciesRequest.isLoading ? (
              <Loader />
            ) : (
              <>
                <SelectItem value="AllServices">{t("provider.history.selectAllServices")}</SelectItem>
                {agencies?.map((agency: Agency) => (
                  <SelectGroup key={agency.id}>
                    <SelectLabel>{agency.name}</SelectLabel>
                    {agency.services.map((service: Service) => (
                      <SelectItem key={service.id} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        <Button variant={"default"} onClick={() => console.log("export")}>
          {t("provider.history.button.export")}
        </Button>
      </div>
      <SessionsHistoryTable agenciesRequest={agenciesRequest} selectedService={selectedService} />
    </div>
  )
}

export default History
