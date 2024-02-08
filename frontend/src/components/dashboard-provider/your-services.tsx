import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Agency } from "@/utils/types.ts"
import { computeServiceDuration } from "@/utils/helpers.ts"

export function YourServices({ agencies, selectedAgency }: { agencies: Agency[] | null; selectedAgency: string }) {
  const allAgencyNameArray = agencies?.map((agency) => agency.name)

  // Filtrer les agences en fonction de l'agence sélectionnée
  const filteredAgencies =
    selectedAgency === "AllAgencies"
      ? agencies || []
      : agencies?.filter((agency) => agency.name === selectedAgency) || []

  return (
    <div className="space-y-8">
      <Accordion type="multiple" defaultValue={allAgencyNameArray} className="w-full">
        {filteredAgencies.map((agency) => (
          <AccordionItem key={agency.id} value={agency.name}>
            <AccordionTrigger>{agency.name}</AccordionTrigger>
            <AccordionContent>
              {agency.services.map((service) => (
                <div key={service.id} className={"flex"}>
                  <p className={"text-sm text-muted-foreground"}>{service.name}</p>
                  <div className={"ml-auto flex items-center gap-2"}>
                    <p className={"text-sm text-muted-foreground"}>{computeServiceDuration(service.duration)}</p>
                    <p className={"text-sm text-muted-foreground"}>{service.price}€</p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
