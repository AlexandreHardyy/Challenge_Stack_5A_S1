import { Spinner } from "@/components/loader/Spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogHeader } from "@/components/ui/dialog"
import { Service } from "@/utils/types"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PencilIcon, PlusCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useFetchServicesByCompany } from "@/services/category.service"
import { AddCategoryContainer, EditCategoryContainer, ServiceForm } from "./form"

const ModalFormService = ({
  service,
  categoryId,
  variant = "ghost",
}: {
  service?: Service
  categoryId: number
  variant?: "ghost" | "outline"
}) => {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2 text-primary">
          {!service ? (
            <>
              {t("providerService.form.cta.newService")}
              <PlusCircleIcon className=" ml-2" />
            </>
          ) : (
            <PencilIcon />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!service ? t("providerService.form.cta.newService") : t("providerService.form.cta.updateService")}
          </DialogTitle>
          <DialogDescription>
            <ServiceForm service={service} categoryId={categoryId} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const ServiceContainer = ({ service, categoryId }: { service: Service; categoryId: number }) => {
  const { t } = useTranslation()
  return (
    <div key={service.id} className="flex flex-col gap-1 pb-6 pl-6 relative w-[33%]">
      <div className="font-bold flex items-center gap-2">
        {service.name}
        <ModalFormService service={service} categoryId={categoryId} />
      </div>
      <p>
        <span className="text-grey-dark">{t("providerService.form.duration")} : </span> {service.duration} min
      </p>
      <p>
        <span className="text-grey-dark">{t("providerService.form.price")} : </span> {service.price} €
      </p>
      <p>
        <span className="text-grey-dark">{t("providerService.form.description")} : </span> {service.description}
      </p>
      <span className="h-2 w-2 bg-primary rounded-full absolute left-0 top-[16px]" />
    </div>
  )
}

const Services = () => {
  const categories = useFetchServicesByCompany(1)
  const { t } = useTranslation()

  if (categories.isLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl mb-6"> {t("providerService.title")} </h1>
      <section>
        <AddCategoryContainer />
        <section className="flex flex-col gap-6">
          {categories.data?.map((category) => {
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex gap-3 items-center">
                    <EditCategoryContainer category={category} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap">
                    {category.services?.map((service) => {
                      return <ServiceContainer key={service.id} service={service} categoryId={category.id} />
                    })}
                  </div>
                  <ModalFormService categoryId={category.id} />
                </CardContent>
              </Card>
            )
          })}
        </section>
      </section>
    </div>
  )
}

export default Services
