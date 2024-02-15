import { DataTable } from "@/components/Table"
import { DeleteModal } from "@/components/delete-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteAgencyById } from "@/services/agency.service"
import { Agency } from "@/utils/types"
import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import ModalAgencyForm from "./modal-agency-form"
import { useTranslation } from "react-i18next"

const ActionColumn = ({ agency }: { agency: Agency }) => {
  const queryClient = useQueryClient()
  const deleteAgency = useDeleteAgencyById()
  return (
    <>
      <DeleteModal
        name={agency.name}
        onDelete={async () => {
          await deleteAgency.mutateAsync(agency.id)
          queryClient.invalidateQueries(["getCompany"])
        }}
      />
      <ModalAgencyForm agency={agency} />
    </>
  )
}

const columns: ColumnDef<Agency>[] = [
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
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { original: agency } }) => {
      return <ActionColumn agency={agency} />
    },
  },
]

type AdminAgenciesListProps = {
  agencies: Agency[]
}

function AdminAgenciesList({ agencies }: AdminAgenciesListProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.companies.table.companyDetails.agenciesList")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={agencies} />
      </CardContent>
    </Card>
  )
}

export default AdminAgenciesList
