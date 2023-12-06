import * as z from "zod"
import { Agency, Category, Service } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast.ts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useContext } from "react"
import { addNewAgency, updateAgencyById } from "@/services"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SelectMultiple } from "@/components/select-multiple.tsx"
import { Button } from "@/components/ui/button.tsx"
import { UseQueryResult } from "@tanstack/react-query"

const agencyFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  services: z.array(z.string()),
})

const AgencyContext = React.createContext<{
  services?: UseQueryResult<Category[], unknown>
  agencies?: UseQueryResult<Agency[], unknown>
}>({})

export default function AgencyForm({ agency, isReadOnly }: { agency?: Agency; isReadOnly: boolean }) {
  const { t } = useTranslation()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof agencyFormSchema>>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      address: agency?.address ?? "",
      city: agency?.city ?? "",
      zip: agency?.zip ?? "",
      name: agency?.name ?? "",
    },
  })

  const { services, agencies } = useContext(AgencyContext)

  const onSubmit = async (values: z.infer<typeof agencyFormSchema>) => {
    const result = await (!agency ? addNewAgency(1, values) : updateAgencyById(agency!.id, values))
    if (result.status === 201) {
      toast({
        variant: "success",
        title: t("ProviderAgencies.form.toast.title"),
        description: t("ProviderAgencies.form.toast.successCreate"),
      })
      agencies?.refetch()
    } else if (result.status === 200) {
      toast({
        variant: "success",
        title: t("ProviderAgencies.form.toast.title"),
        description: t("ProviderAgencies.form.toast.successUpdate"),
      })
      agencies?.refetch()
    } else {
      const isWrongAddress = result.data["hydra:description"].includes("geoloc")
      toast({
        variant: "destructive",
        title: t("ProviderAgencies.form.toast.title"),
        description: isWrongAddress
          ? t("ProviderAgencies.form.toast.addressError")
          : t("ProviderAgencies.form.toast.error"),
      })
    }
  }

  const formattedServices = !services?.data
    ? []
    : services.data.reduce<Service[]>((services, category) => {
        category.services?.forEach((service) => {
          services.push(service)
        })
        return services
      }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderAgencies.form.name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.name")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderAgencies.form.address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.address")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderAgencies.form.city")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.city")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderAgencies.form.zip")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.zip")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services"
          render={() => {
            return (
              <FormItem>
                <FormLabel>{t("ProviderAgencies.form.services")}</FormLabel>
                <FormControl>
                  <SelectMultiple
                    onChange={(ids) => form.setValue("services", ids)}
                    options={formattedServices.map((service) => ({ value: service["@id"], label: service.name }))}
                    defaultData={agency?.services.map((service) => ({ value: service["@id"], label: service.name }))}
                    placeholder={t("ProviderAgencies.form.placeholders.services")}
                    disabled={isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        {!isReadOnly && (
          <Button type="submit">
            {agency ? t("ProviderAgencies.form.cta.update") : t("ProviderAgencies.form.cta.new")}
          </Button>
        )}
      </form>
    </Form>
  )
}
