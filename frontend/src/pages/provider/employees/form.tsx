import { SelectInput } from "@/components/select-input"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAddSchedule } from "@/services/schedule.service"
import { Agency } from "@/utils/types"
import { ScheduleFormSchema, scheduleFormSchema } from "@/zod-schemas/schedule"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

const HOURS = Array.from(Array(14)).map((_, index) => ({ value: String(8 + index), label: `${String(8 + index)}h` }))

export const FormSchedules = ({ agenciesAvalaibles }: { agenciesAvalaibles?: Agency[] }) => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const queryClient = useQueryClient()
  const schedules = useAddSchedule()

  const submit = async (values: ScheduleFormSchema) => {
    await schedules.mutateAsync(values)
    queryClient.invalidateQueries(["getSchedulesByUser"])
  }

  const form = useForm<ScheduleFormSchema>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      dateRange: { from: new Date(), to: new Date() },
      startHour: "9",
      endHour: "18",
      employeeId: Number(userId),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex gap-5 items-end">
        <FormField
          control={form.control}
          name="startHour"
          render={() => (
            <FormItem>
              <FormLabel>{t("employeePage.form.start")}</FormLabel>
              <SelectInput
                options={HOURS}
                placeholder={t("employeePage.form.start")}
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
              <FormLabel>{t("employeePage.form.end")}</FormLabel>
              <SelectInput
                options={HOURS}
                placeholder={t("employeePage.form.end")}
                onSelect={(hour) => form.setValue("endHour", hour)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agencyId"
          render={() => (
            <FormItem>
              <FormLabel>{t("employeePage.form.agency")}</FormLabel>
              <SelectInput
                options={agenciesAvalaibles?.map((agency) => ({ value: String(agency.id), label: agency.name })) ?? []}
                placeholder={t("employeePage.form.agency")}
                onSelect={(id) => form.setValue("agencyId", Number(id))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateRange"
          render={() => (
            <FormItem>
              <FormLabel>{t("employeePage.form.dateRange")}</FormLabel>
              <DateRangePicker
                onDateChange={(date) => form.setValue("dateRange", date)}
                date={form.getValues("dateRange")}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} type="number" readOnly={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {schedules.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("employeePage.form.cta.add")}
        </Button>
      </form>
    </Form>
  )
}
