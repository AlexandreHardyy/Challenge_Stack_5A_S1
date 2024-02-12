import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFetchFeedBackBuildersByCompany } from "@/services/feedback-builders.service"
import { Spinner } from "../loader/Spinner"
import { FeedbackFormSchema, feedbackFormSchema } from "@/zod-schemas/feedback"
import { ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useSendFeedBack } from "@/services/feedback.service"
import { FeedBackBuilder } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import { useQueryClient } from "@tanstack/react-query"

const FeedBackForm = ({
  companyId,
  sessionId,
  feedBackBuilderSelected,
}: {
  companyId: number
  sessionId: number
  feedBackBuilderSelected?: FeedBackBuilder
}) => {
  const { t } = useTranslation()
  const sendFeedBack = useSendFeedBack()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<FeedbackFormSchema>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      session: `/api/sessions/${sessionId}`,
      company: `/api/companies/${companyId}`,
      client: `/api/users/${user?.id}`,
      feedBackBuilder: `/api/feed_back_builders/${feedBackBuilderSelected?.id}`,
      feedbackGroups: [],
    },
  })

  const onAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>, question: string, index: number) => {
    const feedBackGroups = form.getValues().feedbackGroups

    feedBackGroups[index] = {
      question,
      answer: e.target.value,
    }

    form.setValue("feedbackGroups", feedBackGroups)
  }

  const onSubmit = async (values: FeedbackFormSchema) => {
    await sendFeedBack.mutateAsync(values)
    queryClient.invalidateQueries(["getUserById"])
  }

  if (!feedBackBuilderSelected) {
    return <Spinner />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {feedBackBuilderSelected.questions.map((question, index) => {
          return (
            <FormItem key={question}>
              <FormLabel> {question} </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("feedBackInfo.placeholderQuestion")}
                  onChange={(e) => onAnswerChange(e, question, index)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        })}
        <Button type="submit">{t("feedBackInfo.cta.sendFeedBack")}</Button>
      </form>
    </Form>
  )
}

export const ModalFormFeedBack = ({ companyId, sessionId }: { companyId: number; sessionId: number }) => {
  const feedBackBuilders = useFetchFeedBackBuildersByCompany(companyId)
  const { t } = useTranslation()

  if (feedBackBuilders.isLoading) {
    return <Spinner />
  }

  const feedBackBuilderSelected = feedBackBuilders.data?.filter((feedBackBuilder) => feedBackBuilder.isSelected)?.[0]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="px-2 mt-6 w-full">
          {t("feedBackInfo.cta.addtionalFeedBack")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">{t("Send feedback")}</DialogTitle>
          <DialogDescription>
            <FeedBackForm
              companyId={companyId}
              sessionId={sessionId}
              feedBackBuilderSelected={feedBackBuilderSelected}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
