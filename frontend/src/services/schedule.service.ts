import api from "@/utils/api"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { ScheduleFormSchema } from "@/zod-schemas/schedule"

export const useAddSchedule = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (params: ScheduleFormSchema) => {
      const result = await api
        .post("schedules", {
          ...params,
          startHour: Number(params.startHour),
          endHour: Number(params.endHour),
          dateRange: {
            from: format(params.dateRange.from, "yyyy-MM-dd"),
            to: format(params.dateRange.to ?? params.dateRange.from, "yyyy-MM-dd"),
          },
        })
        .catch((err) => err.response)

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
