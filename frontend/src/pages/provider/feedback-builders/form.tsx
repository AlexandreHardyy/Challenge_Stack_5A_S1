import { FeedBackBuilder } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PencilIcon, PlusCircleIcon, Trash2Icon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { FeedBackBuilderFormSchema, feedBackBuilderFormSchema } from "@/zod-schemas/feedback-builders"
import { useAddFeedBackBuilder, useUpdateFeedBackBuilder } from "@/services/feedback-builders.service"
import { Checkbox } from "@/components/ui/checkbox"

const FeedBackBuilderForm = ({
  feedBackBuilder,
  isReadOnly,
}: {
  feedBackBuilder?: FeedBackBuilder
  isReadOnly: boolean
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const addFeedBackBuilder = useAddFeedBackBuilder()
  const updateFeedBackBuilder = useUpdateFeedBackBuilder(feedBackBuilder?.id)
  const { user } = useAuth()

  const form = useForm<FeedBackBuilderFormSchema>({
    resolver: zodResolver(feedBackBuilderFormSchema),
    defaultValues: {
      title: feedBackBuilder?.title ?? "",
      isSelected: feedBackBuilder?.isSelected ?? false,
      questions: feedBackBuilder?.questions,
      company: !feedBackBuilder ? `/api/companies/${user?.company?.id}` : undefined,
    },
  })

  const onSubmit = async (values: FeedBackBuilderFormSchema) => {
    const result = await (!feedBackBuilder
      ? addFeedBackBuilder.mutateAsync(values)
      : updateFeedBackBuilder.mutateAsync(values))
    if (result.status === 201 || result.status === 200) {
      queryClient.invalidateQueries(["getFeedBackBuilders"])
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderFeedBackBuilders.form.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderFeedBackBuilders.form.title")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSelected"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormLabel>{t("ProviderFeedBackBuilders.form.isSelected")}</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="questions"
          render={() => {
            return (
              <FormItem>
                <FormLabel>{t("ProviderFeedBackBuilders.form.questions")}</FormLabel>
                <FormControl>
                  <QuestionForm
                    questions={form.getValues().questions}
                    onChange={(questions) => form.setValue("questions", questions)}
                    disabled={isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        {!isReadOnly && (
          <Button type="submit" className="pt-4">
            {feedBackBuilder
              ? t("ProviderFeedBackBuilders.form.cta.update")
              : t("ProviderFeedBackBuilders.form.cta.new")}
          </Button>
        )}
      </form>
    </Form>
  )
}

function QuestionForm({
  questions = [],
  disabled,
  onChange,
}: {
  questions?: string[]
  disabled?: boolean
  onChange: (questions: string[]) => void
}) {
  const { t } = useTranslation()
  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions]
    newQuestions[index] = event.target.value
    onChange(newQuestions)
  }

  const handleAddQuestion = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const newQuestions = [...questions, ""]
    onChange(newQuestions)
  }

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    onChange(newQuestions)
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((question, index) => (
        <div key={index} className="flex gap-2">
          <Input
            type="text"
            id={`question${index}`}
            value={question}
            onChange={(event) => handleInputChange(index, event)}
            readOnly={disabled}
          />
          {!disabled && (
            <Button
              variant={"ghost"}
              className={"px-2"}
              onClick={(e) => {
                e.preventDefault()
                handleDeleteQuestion(index)
              }}
            >
              <Trash2Icon />
            </Button>
          )}
        </div>
      ))}

      {!disabled && (
        <Button
          onClick={handleAddQuestion}
          variant={"ghost"}
          className="px-2 text-primary self-start flex items-center"
        >
          {t("ProviderFeedBackBuilders.form.cta.addQuestion")}
          <PlusCircleIcon className="ml-2" />
        </Button>
      )}
    </div>
  )
}

export const ModalFormFeedBackBuilder = ({
  feedBackBuilder,
  variant = "ghost",
}: {
  feedBackBuilder?: FeedBackBuilder
  variant?: "ghost" | "outline"
}) => {
  const [isReadOnly, setIsReadOnly] = useState(!!feedBackBuilder)
  const { t } = useTranslation()
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!feedBackBuilder)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!feedBackBuilder ? t("ProviderFeedBackBuilders.form.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!feedBackBuilder ? (
              t("ProviderFeedBackBuilders.form.cta.new")
            ) : (
              <>
                {t("ProviderFeedBackBuilders.form.yourFeedbackBuilder")}
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                    <PencilIcon />
                  </Button>
                )}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <FeedBackBuilderForm feedBackBuilder={feedBackBuilder} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
