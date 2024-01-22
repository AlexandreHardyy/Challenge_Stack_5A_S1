import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Agency } from "@/utils/types"
import { Link } from "react-router-dom"
import { useSearchFiltersContext } from "../search-filters-context"
import { useTranslation } from "react-i18next"

type AgencyCardProps = {
  agency: Agency
}

function AgencyCard({ agency }: AgencyCardProps) {
  const { t } = useTranslation()

  const { filters, setFilters } = useSearchFiltersContext()
  const categoriesNames = new Set(agency.services.map((service) => service.category.name))

  function onSetCategory(categoryName: string) {
    setFilters({
      ...filters,
      category: categoryName,
    })
  }

  return (
    <Card className="flex items-center">
      <Carousel className="w-[92px] h-full flex flex-col">
        <div className="flex grow items-center">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <img
                  alt="companylogo"
                  src="https://www.autoecole-du-griffe.fr/images/logo_auto-ecole_griffe__large.png"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <div className="flex">
          <CarouselPrevious className="grow rounded-none rounded-bl-[8px] static -translate-y-0" />
          <CarouselNext className="grow rounded-none static -translate-y-0" />
        </div>
      </Carousel>
      <div>
        <Link to={`/companies/${agency.company.id}/agencies/${agency.id}`}>
          <CardHeader>
            <CardTitle>{agency.name}</CardTitle>
            <CardDescription>
              {t("searchClient.list.agencyCard.address")}: {agency.address} | {t("searchClient.list.agencyCard.city")}:{" "}
              {agency.city} | {t("searchClient.list.agencyCard.zip")}: {agency.zip}
            </CardDescription>
          </CardHeader>
          <CardContent>{agency.description}</CardContent>
        </Link>
        <CardFooter>
          <div className="flex gap-1">
            {Array.from(categoriesNames).map((categoryName) => {
              return (
                <Badge asChild key={categoryName}>
                  {/* TODO: onClick set category filter */}
                  <button onClick={() => onSetCategory(categoryName)}>{categoryName}</button>
                </Badge>
              )
            })}
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

export default AgencyCard
