import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { FeedBackBuilder } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { DeleteModal } from "@/components/delete-modal"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { useDeleteFeedBackBuilderById, useFetchFeedBackBuildersByCompany } from "@/services/feedback-builders.service"
import { ModalFormFeedBackBuilder } from "./form"
import { Button } from "@/components/ui/button"
import { EyeIcon } from "lucide-react"
import { Link } from "react-router-dom"

const columns: ColumnDef<FeedBackBuilder>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "isSelected",
    header: "Is Selected",
  },
  {
    accessorKey: "questions",
    header: "Number of questions",
    cell: ({ row }) => {
      const questions = row.getValue("questions") as string[]
      return questions.length
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { original: feedBackBuilder } }) => {
      return <ActionColumn feedBackBuilder={feedBackBuilder} />
    },
  },
]

const ActionColumn = ({ feedBackBuilder }: { feedBackBuilder: FeedBackBuilder }) => {
  const queryClient = useQueryClient()
  const deleteFeedBackBuilder = useDeleteFeedBackBuilderById()
  return (
    <>
      <DeleteModal
        name={feedBackBuilder.title}
        onDelete={async () => {
          await deleteFeedBackBuilder.mutateAsync(feedBackBuilder.id)
          queryClient.invalidateQueries(["getFeedBackBuilders"])
        }}
      />
      <ModalFormFeedBackBuilder feedBackBuilder={feedBackBuilder} />
      <Button variant={"ghost"} className="px-2">
        <Link to={`/provider/feedback-builders/${feedBackBuilder.id}/feedbacks`}>
          <EyeIcon />
        </Link>
      </Button>
    </>
  )
}

const FeedBackBuilders = () => {
  const { user } = useAuth()

  const feedBackBuilders = useFetchFeedBackBuildersByCompany(user?.company?.id)
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl"> {t("ProviderFeedBackBuilders.title")} </h1>
      <div className="self-start w-full max-w-xl">
        <ModalFormFeedBackBuilder variant="outline" />
      </div>
      <DataTable isLoading={feedBackBuilders.isLoading} columns={columns} data={feedBackBuilders.data} />
    </div>
  )
}

export default FeedBackBuilders
