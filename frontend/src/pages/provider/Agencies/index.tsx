import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { Agency, Category, Service } from "@/utils/types"
import { useFetchAgenciesByCompany } from "@/services/agency.service"
import { useFetchServicesByCompany } from "@/services/services.service"
import { UseQueryResult } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import ModalAgencyForm from "./ModalAgencyForm"
import React from "react"

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
        <ModalAgencyForm
          // WTFF is that ???
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
          <ModalAgencyForm variant="outline" />
        </div>
        <DataTable isLoading={agencies.isLoading} columns={columns} data={agencies.data} />
      </div>
    </AgencyContext.Provider>
  )
}

export default Agencies
