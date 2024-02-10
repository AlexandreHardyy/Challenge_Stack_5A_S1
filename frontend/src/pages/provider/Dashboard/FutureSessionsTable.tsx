import { DataTable } from "@/components/Table.tsx"
import { useTranslation } from "react-i18next"
import { UseQueryResult } from "@tanstack/react-query"
import { Agency, Service, Session, User } from "@/utils/types.ts"
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
  agenciesRequest,
  agencyId,
}: {
  agenciesRequest: UseQueryResult<Agency[]>
  agencyId: number
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

  const sessions: Session[] = agenciesRequest.data.flatMap((agency: Agency) => {
    return agency.sessions.map((session: Session) => ({
      ...session,
      agency: {
        ...agency,
        id: agency.id,
      },
    }))
  })

  const sessionsByAgencyInTheFuture: Session[] = sessions
    .filter(
      (session: Session) => session.agency.id === agencyId && DateTime.fromISO(session.startDate) >= DateTime.now()
    )
    .map((session: Session) => ({
      ...session,
      startDate: formatDateTime(session.startDate),
      endDate: formatDateTime(session.endDate),
    }))

  if (sessionsByAgencyInTheFuture.length === 0) {
    return <div className="text-center">{t("provider.homeProvider.yourServices.drawer.noSessions")}</div>
  }

  return (
    <DataTable isLoading={agenciesRequest.isLoading} columns={historyColumns(t)} data={sessionsByAgencyInTheFuture} />
  )
}

export default SessionsHistoryTable
