import { DataTable } from "@/components/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Employee } from "@/utils/types"
import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"

type AdminEmployeesListProps = {
  employees: Pick<Employee, "id" | "firstname" | "lastname" | "email">[]
}

const columns: ColumnDef<Pick<Employee, "id" | "firstname" | "lastname" | "email">>[] = [
  {
    accessorKey: "firstname",
    header: () => t("admin.users.table.firstName"),
  },
  {
    accessorKey: "lastname",
    header: () => t("admin.users.table.lastName"),
  },
  {
    accessorKey: "email",
    header: () => t("admin.users.table.email"),
  },
]

function AdminEmployeesList({ employees }: Readonly<AdminEmployeesListProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.companies.table.companyDetails.employeesList")}</CardTitle>
      </CardHeader>
      <CardContent>
        {employees ? (
          <DataTable columns={columns} data={employees} />
        ) : (
          <p>{t("admin.companies.table.companyDetails.noEmployees")}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminEmployeesList
