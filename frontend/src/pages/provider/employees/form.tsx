import { Spinner } from "@/components/loader/Spinner"
import { SelectInput } from "@/components/select-input"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useFetchAgenciesByCompany } from "@/services"
import { scheduleFormSchema, useAddSchedule } from "@/services/schedule.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { z } from "zod"

const HOURS = Array.from(Array(14)).map((_, index) => ({ value: String(8 + index), label: `${String(8 + index)}h` }))

export const FormSchedules = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const { user } = useAuth()
  const schedules = useAddSchedule()
  const agencies = useFetchAgenciesByCompany(user?.company?.id)
  const onSubmit = async (values: z.infer<typeof scheduleFormSchema>) => {
    schedules.mutate(values)
  }

  const form = useForm<z.infer<typeof scheduleFormSchema>>({
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-5 items-end">
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
              {agencies.isLoading && <Spinner />}
              {!agencies.isLoading && (
                <>
                  <FormLabel>{t("employeePage.form.agency")}</FormLabel>
                  <SelectInput
                    options={agencies?.data?.map((agency) => ({ value: String(agency.id), label: agency.name })) ?? []}
                    placeholder={t("employeePage.form.agency")}
                    onSelect={(id) => form.setValue("agencyId", Number(id))}
                  />
                  <FormMessage />
                </>
              )}
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
