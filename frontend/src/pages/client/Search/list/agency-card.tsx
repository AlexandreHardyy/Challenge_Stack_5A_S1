import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Agency } from "@/utils/types"
import { Link } from "react-router-dom"

type AgencyCardProps = {
  agency: Agency
}

function AgencyCard ({ agency }: AgencyCardProps) {
  const categories = new Set(agency.services.map(service => service.category.name))

  return (
    <Card className="flex items-center">
      <Carousel className="w-[92px] flex flex-col">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <img  
                alt="companylogo"
                className="rounded-[92px] w-[92px] h-[92px]"
                src="https://www.autoecole-du-griffe.fr/images/logo_auto-ecole_griffe__large.png"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div>
          <CarouselPrevious className="static -translate-y-0" />
          <CarouselNext className="static -translate-y-0"/>
        </div>
      </Carousel>
      <div>
        <Link to={`/companies/${agency.company.id}/agencies/${agency.id}`}>
          <CardHeader>
            <CardTitle>{agency.name}</CardTitle>
            <CardDescription>Address: {agency.address} | City: {agency.city} | Zip code: {agency.zip}</CardDescription>
          </CardHeader>
          <CardContent>
            {agency.description}
          </CardContent>
        </Link>
        <CardFooter>
          <div>
            {Array.from(categories).map(category => {
              return (
                <Badge asChild key={category}>
                  {/* TODO: onClick set category filter */}
                  <button onClick={() => console.log(category)} >
                    {category}
                  </button>
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