import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { ScheduleException } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import { t } from "i18next"
import { useFetchScheduleExceptionsByCompany, useValidateScheduleException } from "@/services/schedule.service"
import { Button } from "@/components/ui/button"
import { CheckIcon, X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

const columns: ColumnDef<ScheduleException>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "firstname",
    header: "First name",
  },
  {
    accessorKey: "lastname",
    header: "Last name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "startHour",
    header: "Start Hour",
  },
  {
    accessorKey: "endHour",
    header: "End Hour",
  },
  {
    accessorKey: "status",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { original: scheduleException } }) => {
      return <ActionColumn scheduleException={scheduleException} />
    },
  },
]

const ActionColumn = ({ scheduleException }: { scheduleException: ScheduleException }) => {
  const validationSchedule = useValidateScheduleException(scheduleException.id)
  const queryClient = useQueryClient()

  const onValidate = async (status: string) => {
    await validationSchedule.mutateAsync(status)
    queryClient.invalidateQueries(["getScheduleExceptions"])
  }
  return (
    <div className="flex gap-2">
      <Button className="px-2" onClick={() => onValidate("VALIDATED")}>
        <CheckIcon />
      </Button>
      <Button variant={"destructive"} className="px-2" onClick={() => onValidate("REFUSED")}>
        <X />
      </Button>
    </div>
  )
}

const ScheduleExceptions = () => {
  const { user } = useAuth()

  const scheduleExceptions = useFetchScheduleExceptionsByCompany(user?.company?.id)

  const filteredScheduleExceptions = scheduleExceptions.data?.filter(
    (scheduleException) => scheduleException.status === "PROCESSING"
  )

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl"> {t("ProviderAgencies.title")} </h1>
      <div className="self-start w-full max-w-xl">{/* <ModalAgencyForm variant="outline" /> */}</div>
      <DataTable isLoading={scheduleExceptions.isLoading} columns={columns} data={filteredScheduleExceptions} />
    </div>
  )
}

export default ScheduleExceptions
