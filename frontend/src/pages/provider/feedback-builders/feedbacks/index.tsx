import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { useFetchFeedBacksByBuilder } from "@/services/feedback.service"
import { useParams } from "react-router-dom"
import { FeedBack, FeedBackGroup } from "@/utils/types"
import { format } from "date-fns"
import { t } from "i18next"

const columns: ColumnDef<FeedBack>[] = [
  {
    accessorKey: "createdAt",
    header: () => t("ProviderFeedBack.sentDate"),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return <>{format(new Date(createdAt), "LLL dd, y")}</>
    },
  },
  {
    accessorKey: "feedBackGroups",
    header: () => t("ProviderFeedBack.questionAnswer"),
    cell: ({ row }) => {
      const feedBackGroups = row.getValue("feedBackGroups") as FeedBackGroup[]
      return feedBackGroups.map((feedBackGroup) => {
        return (
          <div key={feedBackGroup.answer} className="flex gap-2">
            <p className="font-bold">{feedBackGroup.question}</p>
            <p>{feedBackGroup.answer}</p>
          </div>
        )
      })
    },
  },
]

const FeedBacks = () => {
  const { id } = useParams()

  const feedBacks = useFetchFeedBacksByBuilder(Number(id))
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl"> {t("ProviderFeedBack.title")} </h1>
      <DataTable isLoading={feedBacks.isLoading} columns={columns} data={feedBacks.data} />
    </div>
  )
}

export default FeedBacks
