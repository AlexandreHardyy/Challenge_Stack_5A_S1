import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/utils/types";

interface servicesGroupedByCategory {
  categoryName: string,
  services: Service[]
}

export function ServiceList ({services}: {services: Service[]}) {
  const servicesGroupedByCategory = services.reduce((acc: servicesGroupedByCategory[], curr) => {
    const index = acc.findIndex(elem => elem.categoryName === curr.category.name)
    if (index !== -1) {
      acc[index].services = [
        ...acc[index].services,
        curr
      ]
    } else {
      acc.push({
        categoryName: curr.category.name,
        services: [curr]
      })
    }

    return acc
  }, [])

  return (
    <div className="flex flex-col gap-[30px]">
      {servicesGroupedByCategory.map(category => {
        return (
          <div key={category.categoryName}>
            <h2 className="text-[32px] mb-[17px] font-bold">{category.categoryName}</h2>
            <div className="bg-secondary p-[20px] flex flex-col rounded-[8px]">
              {category.services.map((service, index) => {
                return (
                  <div key={service.name}>
                    <div  className="flex justify-between items-end">
                      <div>
                        <h3 className="text-[20px] font-bold">{service.name}</h3>
                        <p className="mt-[5px] text-[16px]">
                          {service.description}
                        </p>
                      </div>
                      <div  className="flex gap-[35px] items-center">
                        <p className="text-[20px] font-bold">{service.duration >= 1 ? `${service.duration}h` : `${service.duration * 60}min`}</p>
                        <p className="text-[20px] font-bold">{service.price} €</p>
                        <Button className="bg-primary">Réserver</Button>
                      </div>
                    </div>
                    {index !== (category.services.length - 1) && <Separator className="my-[20px] bg-grey-medium"/>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}