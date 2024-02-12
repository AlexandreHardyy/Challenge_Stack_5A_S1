import { DataTable } from "@/components/Table.tsx"
import { useTranslation } from "react-i18next"
import { UseQueryResult } from "@tanstack/react-query"
import { Company, Service, Session, User } from "@/utils/types.ts"
import { TFunction } from "i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { formatDateTime } from "@/utils/helpers.ts"
import { DateTime } from "luxon"

function historyColumns(t: TFunction<"translation", undefined>): ColumnDef<Session>[] {
  return [
    {
      accessorKey: "student",
      header: t("sessionTable.student"),
      cell: ({ row }) => {
        const student = row.getValue("student") as User
        return student.firstname + " " + student.lastname
      },
    },
    {
      accessorKey: "instructor",
      header: t("sessionTable.instructor"),
      cell: ({ row }) => {
        const instructor = row.getValue("instructor") as User
        return instructor.firstname + " " + instructor.lastname
      },
    },
    {
      accessorKey: "startDate",
      header: t("sessionTable.startDate"),
    },
    {
      accessorKey: "endDate",
      header: t("sessionTable.endDate"),
    },
    {
      accessorKey: "service",
      header: t("sessionTable.service"),
      cell: ({ row }) => {
        const service = row.getValue("service") as Service
        return service.name
      },
    },
    {
      accessorKey: "price",
      header: t("sessionTable.price"),
      cell: ({ row }) => {
        const service = row.getValue("service") as Service
        return service.price + "€"
      },
    },
  ]
}

const SessionsHistoryTable = ({
  companiesRequest,
  companyId,
}: {
  companiesRequest: UseQueryResult<Company[]>
  companyId: number
}) => {
  const { t } = useTranslation()

  if (companiesRequest.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (companiesRequest.isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner />
      </div>
    )
  }

  const sessions =
    companiesRequest.data?.flatMap((company) => company.agencies.flatMap((agency) => agency.sessions)) ?? []

  const sessionsByAgencyInTheFuture: Session[] = sessions
    .filter(
      (session: Session) => session.agency.id === companyId && DateTime.fromISO(session.startDate) >= DateTime.now()
    )
    .map((session: Session) => ({
      ...session,
      startDate: formatDateTime(session.startDate),
      endDate: formatDateTime(session.endDate),
    }))

  if (sessionsByAgencyInTheFuture.length === 0) {
    return <div className="text-center">{t("provider.dashboard.yourServices.drawer.noSessions")}</div>
  }

  return (
    <DataTable isLoading={companiesRequest.isLoading} columns={historyColumns(t)} data={sessionsByAgencyInTheFuture} />
  )
}

export default SessionsHistoryTable
