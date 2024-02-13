import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx"
import { Company, Session } from "@/utils/types.ts"
import { Flame, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { t } from "i18next"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Loader } from "@/components/ui/loader.tsx"
import FutureSessionsTable from "@/pages/admin/dashboard/FutureSessionsTable.tsx"
import { UseQueryResult } from "@tanstack/react-query"

function YourAgencies({
  companies,
  selectedCompany,
  mostSoldAgency,
  sessionsRequest,
  areCompaniesLoading,
}: Readonly<{
  companies: Company[] | null
  selectedCompany: string
  mostSoldAgency: [string, number] | undefined
  sessionsRequest: UseQueryResult<Session[]>
  areCompaniesLoading: boolean
}>) {
  const allCompanyNameArray = companies?.map((company) => company.socialReason)

  // Filtrer les agences en fonction de l'agence sélectionnée
  const filteredCompanies =
    selectedCompany === "AllCompanies"
      ? companies ?? []
      : companies?.filter((agency) => agency.socialReason === selectedCompany) ?? []

  return (
    <div className="space-y-8">
      <Accordion type="multiple" defaultValue={allCompanyNameArray}>
        {filteredCompanies.map((company) => (
          <AccordionItem key={company.id} value={company.socialReason}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                {company.socialReason}
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  3.5
                </div>
              </div>
            </AccordionTrigger>
            <Drawer key={company.id}>
              <DrawerTrigger className="w-full">
                <AccordionContent className="flex flex-col px-2 hover:underline">
                  {company.agencies.map((agency) => (
                    <div key={agency.id} className="flex">
                      <p className={"text-sm text-muted-foreground flex items-center gap-2"}>
                        {agency.name}
                        {mostSoldAgency && mostSoldAgency[0] && mostSoldAgency[0] === agency.name && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className={"text-amber-600"}>
                                  <Flame size={18} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("admin.dashboard.yourAgencies.tooltip")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </p>
                      <div className={"ml-auto flex items-center gap-1"}>
                        <p className={"text-sm text-muted-foreground"}>{agency.address}</p>
                        <p className={"text-sm text-muted-foreground"}>{agency.city}</p>
                        <p className={"text-sm text-muted-foreground"}>{agency.zip}</p>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t("admin.dashboard.yourAgencies.drawer.title")}</DrawerTitle>
                  <DrawerDescription>
                    {t("admin.dashboard.yourAgencies.drawer.description", { companyName: company.socialReason })}
                  </DrawerDescription>
                </DrawerHeader>
                {areCompaniesLoading ? (
                  <Loader />
                ) : (
                  <FutureSessionsTable
                    sessionsRequest={sessionsRequest}
                    agenciesIdArray={company.agencies.reduce((acc, agency) => {
                      acc.push(agency.id.toString())
                      return acc
                    }, [] as string[])}
                  />
                )}
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default YourAgencies
