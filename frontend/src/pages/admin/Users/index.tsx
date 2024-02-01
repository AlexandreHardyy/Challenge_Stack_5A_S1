import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { useFetchUsers } from "@/services/user/user.service"
import { User } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import ModalUserForm from "./ModalUserForm"

function usersColumns(t: TFunction<"translation", undefined>): ColumnDef<User>[] {
  return [
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
    {
      accessorKey: "roles",
      header: t("admin.users.table.roles"),
    },
    {
      accessorKey: "isVerified",
      header: t("admin.users.table.isVerified"),
    },
    {
      accessorKey: "createdAt",
      header: t("admin.users.table.createdAt"),
    },
    {
      accessorKey: "updatedAt",
      header: t("admin.users.table.updatedAt"),
    },
    {
      accessorKey: "actions",
      header: t("admin.users.table.actions"),
      cell: ({ row: { getValue: val } }) => {
        return (
          // Problem here
          <ModalUserForm
            user={{
              id: val("id"),
              firstname: val("firstname"),
              lastname: val("lastname"),
              email: val("email"),
              roles: val("roles"),
              isVerified: val("isVerified"),
              createdAt: val("createdAt"),
              updatedAt: val("updatedAt"),
            }}
          />
        )
      },
    },
  ]
}

const Users = () => {
  const { t } = useTranslation()
  const usersRequest = useFetchUsers()

  if (usersRequest.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (usersRequest.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  const users: User[] = usersRequest.data

  const formattedUsers: User[] = users.map((user: User) => ({
    ...user,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  }))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("admin.users.title")}</h1>
      <div className="self-start w-full max-w-xl">
        <ModalUserForm variant="outline" />
      </div>
      <DataTable isLoading={usersRequest.isLoading} columns={usersColumns(t)} data={formattedUsers} />
    </div>
  )
}

export default Users
