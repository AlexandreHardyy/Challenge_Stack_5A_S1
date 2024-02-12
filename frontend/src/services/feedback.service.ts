import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { FeedbackFormSchema } from "@/zod-schemas/feedback"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useSendFeedBack = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: FeedbackFormSchema) => {
      const result = await api.post("feed_backs", body)

      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("feedBackInfo.toast.title"),
          description: t("feedBackInfo.toast.success"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("feedBackInfo.toast.title"),
          description: t("feedBackInfo.toast.error"),
        })
      }

      return result
    },
  })
}
