import api from "@/utils/api"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"

export const scheduleFormSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.optional(z.date()),
  }),
  startHour: z.string(),
  endHour: z.string(),
  agencyId: z.number(),
  employeeId: z.number(),
})

export const useAddSchedule = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (params: z.infer<typeof scheduleFormSchema>) => {
      const result = await api.post("schedules", {
        ...params,
        startHour: Number(params.startHour),
        endHour: Number(params.endHour),
        dateRange: {
          from: format(params.dateRange.from, "yyyy-MM-dd"),
          to: format(params.dateRange.to ?? params.dateRange.from, "yyyy-MM-dd"),
        },
      })

      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.error"),
        })
      }

      return result
    },
  })
}
