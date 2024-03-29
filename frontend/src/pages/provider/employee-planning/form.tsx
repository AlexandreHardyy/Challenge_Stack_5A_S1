import { Employee } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"

import { Button } from "@/components/ui/button.tsx"

import { useAuth } from "@/context/AuthContext"
import { ScheduleExceptionsFormSchema, scheduleExceptionsFormSchema } from "@/zod-schemas/schedule"
import { SelectInput } from "@/components/select-input"
import { format } from "date-fns"
import { useAddScheduleException, useFetchScheduleByUser } from "@/services/schedule.service"
import { useQueryClient } from "@tanstack/react-query"
import { Spinner } from "@/components/loader/Spinner"
import { Loader2 } from "lucide-react"

const HOURS = Array.from(Array(14)).map((_, index) => ({ value: String(8 + index), label: `${String(8 + index)}h` }))

export const ScheduleExceptionsForm = () => {
  const { t } = useTranslation()
  const employee = useAuth().user as Employee
  const addScheduleException = useAddScheduleException()
  const schedules = useFetchScheduleByUser(employee.id)
  const queryClient = useQueryClient()

  const form = useForm<ScheduleExceptionsFormSchema>({
    resolver: zodResolver(scheduleExceptionsFormSchema),
    defaultValues: {
      startHour: "9",
      endHour: "18",
      status: "PROCESSING",
    },
  })

  if (schedules.isLoading) {
    return (
      <div className="flex items-center">
        <Spinner />
      </div>
    )
  }

  if (schedules.data?.length === 0) {
    return <div className="flex items-center">{t("You dont have work shedules.")}</div>
  }

  const onSubmit = async (values: ScheduleExceptionsFormSchema) => {
    const result = await addScheduleException.mutateAsync(values)
    if (result.status === 201) {
      queryClient.invalidateQueries(["getScheduleExceptions"])
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end">
        <FormField
          control={form.control}
          name="schedule"
          render={() => (
            <FormItem>
              <FormLabel>{t("provider.myPlanning.form.schedule")}</FormLabel>
              <SelectInput
                options={(schedules.data ?? []).map((schedule) => ({
                  value: `/api/schedules/${schedule.id}`,
                  label: format(new Date(schedule.date), "LLL dd, y"),
                }))}
                placeholder={t("provider.myPlanning.form.schedule")}
                onSelect={(schedule) => form.setValue("schedule", schedule)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startHour"
          render={() => (
            <FormItem>
              <FormLabel>{t("provider.myPlanning.form.start")}</FormLabel>
              <SelectInput
                options={HOURS}
                placeholder={t("provider.myPlanning.form.start")}
                onSelect={(hour) => form.setValue("startHour", hour)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endHour"
          render={() => (
            <FormItem>
              <FormLabel>{t("provider.myPlanning.form.end")}</FormLabel>
              <SelectInput
                options={HOURS}
                placeholder={t("provider.myPlanning.form.end")}
                onSelect={(hour) => form.setValue("endHour", hour)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={addScheduleException.isLoading} type="submit">
          {addScheduleException.isLoading && <Loader2 />}
          {t("provider.myPlanning.form.cta.new")}
        </Button>
      </form>
    </Form>
  )
}
