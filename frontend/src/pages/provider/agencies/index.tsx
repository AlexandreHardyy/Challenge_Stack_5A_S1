import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { Agency, Service } from "@/utils/types"
import { useDeleteAgencyById, useFetchAgenciesByCompany } from "@/services/agency.service"
import { useTranslation } from "react-i18next"
import { useFetchServicesGroupByCategory } from "@/services/category.service"
import ModalAgencyForm from "@/pages/provider/agencies/form"
import React, { useMemo } from "react"
import { DeleteModal } from "@/components/delete-modal"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"

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
    accessorKey: "services",
    cell: ({ row }) => {
      const services = row.getValue("services") as Service[]
      return services.map((service) => service.name).join(", ")
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { original: agency } }) => {
      return <ActionColumn agency={agency} />
    },
  },
]

const ActionColumn = ({ agency }: { agency: Agency }) => {
  const queryClient = useQueryClient()
  const deleteAgency = useDeleteAgencyById()
  return (
    <>
      <DeleteModal
        name={agency.name}
        onDelete={async () => {
          await deleteAgency.mutateAsync(agency.id)
          queryClient.invalidateQueries(["getAgencies"])
        }}
      />
      <ModalAgencyForm agency={agency} />
    </>
  )
}

export const AgencyContext = React.createContext<{
  services: Service[]
}>({ services: [] })

const Agencies = () => {
  const { user } = useAuth()

  const agencies = useFetchAgenciesByCompany(user?.company?.id)
  const services = useFetchServicesGroupByCategory(user?.company?.id)
  const { t } = useTranslation()

  const formattedServices = useMemo(() => {
    return !services?.data
      ? []
      : services.data.reduce<Service[]>((services, category) => {
          category.services?.forEach((service) => {
            services.push(service)
          })
          return services
        }, [])
  }, [services.data])

  return (
    <AgencyContext.Provider value={{ services: formattedServices }}>
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
