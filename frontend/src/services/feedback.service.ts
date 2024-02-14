import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { FeedBack } from "@/utils/types"
import { FeedbackFormSchema } from "@/zod-schemas/feedback"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export function useFetchFeedBacksByBuilder(builderId?: number) {
  return useQuery<FeedBack[]>(["getFeedBacks"], async () => {
    const response = await api.get(`feed_back_builders/${builderId}/feed_backs`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getFeedBacks)")
    }

    return response.data["hydra:member"]
  })
}

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
