import { DataTable } from "@/components/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Employee } from "@/utils/types"
import { ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

type AdminEmployeesListProps = {
  employees: Pick<Employee, "id" | "firstname" | "lastname" | "email">[]
}

function AdminEmployeesList({ employees }: AdminEmployeesListProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Pick<Employee, "id" | "firstname" | "lastname" | "email">>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => column.toggleVisibility(false),
    },
    {
      accessorKey: "firstname",
      header: t("admin.users.table.firstName"),
    },
    {
      accessorKey: "lastname",
      header: t("admin.users.table.lastName"),
    },
    {
      accessorKey: "email",
      header: t("admin.users.table.email"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.companies.table.companyDetails.employeesList")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={employees} />
      </CardContent>
    </Card>
  )
}

export default AdminEmployeesList
