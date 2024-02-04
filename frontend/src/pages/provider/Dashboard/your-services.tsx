import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx"
import { Agency } from "@/utils/types.ts"
import { computeServiceDuration } from "@/utils/helpers.ts"
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
import FutureSessionsTable from "@/pages/provider/Dashboard/FutureSessionsTable.tsx"
import { UseQueryResult } from "@tanstack/react-query"

function YourServices({
  agencies,
  selectedAgency,
  mostSoldService,
  agenciesRequest,
  isSessionsLoading,
}: Readonly<{
  agencies: Agency[] | null
  selectedAgency: string
  mostSoldService: [string, number] | undefined
  agenciesRequest: UseQueryResult<Agency[]>
  isSessionsLoading: boolean
}>) {
  const allAgencyNameArray = agencies?.map((agency) => agency.name)

  // Filtrer les agences en fonction de l'agence sélectionnée
  const filteredAgencies =
    selectedAgency === "AllAgencies"
      ? agencies ?? []
      : agencies?.filter((agency) => agency.name === selectedAgency) ?? []

  return (
    <div className="space-y-8">
      <Accordion type="multiple" defaultValue={allAgencyNameArray}>
        {filteredAgencies.map((agency) => (
          <AccordionItem key={agency.id} value={agency.name}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                {agency.name}
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  3.5
                </div>
              </div>
            </AccordionTrigger>
            <Drawer key={agency.id}>
              <DrawerTrigger className="w-full">
                <AccordionContent className="flex flex-col px-2 hover:underline">
                  {agency.services.map((service) => (
                    <div key={service.id} className="flex">
                      <p className={"text-sm text-muted-foreground flex items-center gap-2"}>
                        {service.name}
                        {mostSoldService && mostSoldService[0] && mostSoldService[0] === service.name && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className={"text-amber-600"}>
                                  <Flame size={18} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("provider.homeProvider.yourServices.tooltip")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </p>
                      <div className={"ml-auto flex items-center gap-2"}>
                        <p className={"text-sm text-muted-foreground"}>{computeServiceDuration(service.duration)}</p>
                        <p className={"text-sm text-muted-foreground"}>{service.price}€</p>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t("provider.homeProvider.yourServices.drawer.title")}</DrawerTitle>
                  <DrawerDescription>
                    {t("provider.homeProvider.yourServices.drawer.description", { agencyName: agency.name })}
                  </DrawerDescription>
                </DrawerHeader>
                {isSessionsLoading ? (
                  <Loader />
                ) : (
                  <FutureSessionsTable agenciesRequest={agenciesRequest} agencyId={agency.id} />
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

export default YourServices
