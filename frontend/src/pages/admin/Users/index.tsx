import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { useFetchUsers } from "@/services/user/user.service"
import { User } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { t } from "i18next"
import ModalUserForm from "./ModalUserForm"
import { Badge } from "@/components/ui/badge.tsx"

const columns: ColumnDef<User>[] = [
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
  {
    accessorKey: "roles",
    header: () => t("admin.users.table.roles"),
    cell: ({ row }) => {
      return (
        <div className={"flex gap-2"}>
          {row.original.roles?.map((role) => {
            return <Badge key={role}>{role.split("_")[1]}</Badge>
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "isVerified",
    header: () => t("admin.users.table.isVerified"),
  },
  {
    accessorKey: "createdAt",
    header: () => t("admin.users.table.createdAt"),
    cell: ({ row: { original: user } }) => formatDate(user.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: () => t("admin.users.table.updatedAt"),
    cell: ({ row: { original: user } }) => formatDate(user.updatedAt),
  },
  {
    accessorKey: "actions",
    header: () => t("admin.users.table.actions"),
    cell: ({ row: { original: user } }) => {
      return <ModalUserForm user={user} />
    },
  },
]

const Users = () => {
  const users = useFetchUsers()

  if (users.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (users.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("admin.users.title")}</h1>
      <div className="self-start w-full max-w-xl">
        <ModalUserForm variant="outline" />
      </div>
      <DataTable isLoading={users.isLoading} columns={columns} data={users.data} />
    </div>
  )
}

export default Users
