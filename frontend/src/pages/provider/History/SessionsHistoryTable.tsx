import { DataTable } from "@/components/Table.tsx"
import { useTranslation } from "react-i18next"
import { UseQueryResult } from "@tanstack/react-query"
import { Agency, Service, Session, User } from "@/utils/types.ts"
import { TFunction } from "i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { formatDateTime } from "@/utils/helpers.ts"

function historyColumns(t: TFunction<"translation", undefined>): ColumnDef<Session>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "student",
      header: t("provider.history.table.student"),
      cell: ({ row }) => {
        const student = row.getValue("student") as User
        return student.firstname + " " + student.lastname
      },
    },
    {
      accessorKey: "instructor",
      header: t("provider.history.table.instructor"),
      cell: ({ row }) => {
        const instructor = row.getValue("instructor") as User
        return instructor.firstname + " " + instructor.lastname
      },
    },
    {
      accessorKey: "startDate",
      header: t("provider.history.table.startDate"),
    },
    {
      accessorKey: "endDate",
      header: t("provider.history.table.endDate"),
    },
    {
      accessorKey: "service",
      header: t("provider.history.table.service"),
      cell: ({ row }) => {
        const service = row.getValue("service") as Service
        return service.name
      },
    },
    {
      accessorKey: "price",
      header: t("provider.history.table.price"),
      cell: ({ row }) => {
        const service = row.getValue("service") as Service
        return service.price + "€"
      },
    },
    {
      accessorKey: "agency",
      header: t("provider.history.table.agency"),
      cell: ({ row }) => {
        const agency = row.getValue("agency") as Agency
        return agency.name
      },
    },
  ]
}

const SessionsHistoryTable = ({
  agenciesRequest,
  selectedService,
}: {
  agenciesRequest: UseQueryResult<Agency[]>
  selectedService: string
}) => {
  const { t } = useTranslation()
  if (agenciesRequest.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (agenciesRequest.isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner />
      </div>
    )
  }

  const agencies = agenciesRequest.status === "success" ? agenciesRequest.data : []

  const sessions: Session[] = agencies.flatMap((agency: Agency) => agency.sessions)

  const formattedSessions: Session[] = sessions
    .filter((session: Session) => {
      return (
        session.endDate < new Date().toISOString() &&
        (session.service.name === selectedService || selectedService === "AllServices")
      )
    })
    .map((session: Session) => ({
      ...session,
      startDate: formatDateTime(session.startDate),
      endDate: formatDateTime(session.endDate),
    }))
  return <DataTable isLoading={agenciesRequest.isLoading} columns={historyColumns(t)} data={formattedSessions} />
}

export default SessionsHistoryTable
