import { DataTable } from "@/components/Table"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { ColumnDef } from "@tanstack/react-table"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useContext, useState } from "react"
import { PencilIcon } from "lucide-react"
import { Agency, Category, Service } from "@/utils/types"
import { SelectMultiple } from "@/components/select-multiple"
import { addNewAgency, updateAgencyById, useFetchAgenciesByCompany } from "@/services/agency.service"
import { useFetchServicesByCompany } from "@/services/services.service"
import { UseQueryResult } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"

const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "zip",
    header: "Zip code",
  },
  {
    accessorKey: "description",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "company",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "geoloc",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "services",
    cell: ({ row }) => {
      const services = row.getValue("services") as Service[]
      return services.map((service) => service.name).join(", ")
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { getValue: val } }) => {
      return (
        <ModalFormAgency
          agency={{
            id: val("id"),
            address: val("address"),
            city: val("city"),
            zip: val("zip"),
            name: val("name"),
            description: val("description"),
            company: val("company"),
            services: val("services"),
            geoloc: val("geoloc"),
          }}
        />
      )
    },
  },
]

const agencyFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  services: z.array(z.string()),
})

const AgencyForm = ({ agency, isReadOnly }: { agency?: Agency; isReadOnly: boolean }) => {
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

const ModalFormAgency = ({ agency, variant = "ghost" }: { agency?: Agency; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsreadOnly] = useState(!!agency)
  const { t } = useTranslation()
  return (
    <Dialog onOpenChange={(open) => !open && setIsreadOnly(!!agency)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!agency ? t("ProviderAgencies.form.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!agency ? (
              t("ProviderAgencies.form.cta.new")
            ) : (
              <>
                Your agency{" "}
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsreadOnly(!isReadOnly)}>
                    {" "}
                    <PencilIcon />{" "}
                  </Button>
                )}{" "}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <AgencyForm agency={agency} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const AgencyContext = React.createContext<{
  services?: UseQueryResult<Category[], unknown>
  agencies?: UseQueryResult<Agency[], unknown>
}>({})

const Agencies = () => {
  const agencies = useFetchAgenciesByCompany(1)
  const services = useFetchServicesByCompany(1)
  const { t } = useTranslation()

  return (
    <AgencyContext.Provider value={{ services, agencies }}>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl"> {t("ProviderAgencies.title")} </h1>
        <div className="self-start w-full max-w-xl">
          <ModalFormAgency variant="outline" />
        </div>
        <DataTable isLoading={agencies.isLoading} columns={columns} data={agencies.data} />
      </div>
    </AgencyContext.Provider>
  )
}

export default Agencies
