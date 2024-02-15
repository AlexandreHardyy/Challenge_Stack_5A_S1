import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx"
import { Agency, Session } from "@/utils/types.ts"
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
import FutureSessionsTable from "@/pages/provider/dashboard/FutureSessionsTable.tsx"
import { UseQueryResult } from "@tanstack/react-query"

function YourServices({
  agencies,
  selectedAgency,
  mostSoldService,
  sessionsRequest,
  isSessionsLoading,
}: Readonly<{
  agencies: Agency[] | null
  selectedAgency: string
  mostSoldService: [string, number] | undefined
  sessionsRequest: UseQueryResult<Session[]>
  isSessionsLoading: boolean
}>) {
  const allAgencyNameArray = agencies?.map((agency) => agency.name)

  const filteredAgencies =
    selectedAgency === "AllAgencies"
      ? agencies ?? []
      : agencies?.filter((agency) => agency.name === selectedAgency) ?? []

  const averageAgenciesRating = (sessions: Session[]) => {
    const totalRatings = sessions.reduce((acc, session) => {
      if (session.ratingService) {
        return acc + session.ratingService.rating
      }
      return acc
    }, 0)
    const totalSessions = (sessions.filter((session) => session.ratingService) ?? []).length
    return totalRatings && totalSessions ? totalRatings / totalSessions : 0
  }

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
                  {averageAgenciesRating(agency.sessions)}
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
                                <p>{t("provider.dashboard.yourServices.tooltip")}</p>
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
                  <DrawerTitle>{t("provider.dashboard.yourServices.drawer.title")}</DrawerTitle>
                  <DrawerDescription>
                    {t("provider.dashboard.yourServices.drawer.description", { agencyName: agency.name })}
                  </DrawerDescription>
                </DrawerHeader>
                {isSessionsLoading ? (
                  <Loader />
                ) : (
                  <FutureSessionsTable sessionsRequest={sessionsRequest} agencyId={agency.id} />
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
