import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { FeedBackBuilder } from "@/utils/types"
import { FeedBackBuilderFormSchema } from "@/zod-schemas/feedback-builders"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export function useFetchFeedBackBuildersByCompany(companyId?: number) {
  return useQuery<FeedBackBuilder[]>(["getFeedBackBuilders"], async () => {
    const response = await api.get(`companies/${companyId}/feed_back_builders`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getFeedBackBuilders)")
    }

    return response.data["hydra:member"]
  })
}

export const useAddFeedBackBuilder = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: FeedBackBuilderFormSchema) => {
      const result = await api
        .post(`feed_back_builders`, body, {
          headers: {
            "Content-Type": "application/ld+json",
          },
        })
        .catch((err) => err.response)
      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: t("ProviderFeedBackBuilders.form.toast.successCreate"),
        })
      } else {
        const isWrongAddress = result.data["hydra:description"].includes("geoloc")
        toast({
          variant: "destructive",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: isWrongAddress
            ? t("ProviderFeedBackBuilders.form.toast.addressError")
            : t("ProviderFeedBackBuilders.form.toast.error"),
        })
      }

      return result
    },
  })
}

export const useUpdateFeedBackBuilder = (feedBackBuilderId?: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: FeedBackBuilderFormSchema) => {
      const result = await api
        .patch(`feed_back_builders/${feedBackBuilderId}`, body, {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        })
        .catch((err) => err.response)

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: t("ProviderFeedBackBuilders.form.toast.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: t("ProviderFeedBackBuilders.form.toast.error"),
        })
      }

      return result
    },
  })
}

export const useDeleteFeedBackBuilderById = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (feedBackBuilderId: number) => {
      const result = await api.delete(`feed_back_builders/${feedBackBuilderId}`).catch((err) => err.response)
      if (result.status === 204) {
        toast({
          variant: "success",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: t("ProviderFeedBackBuilders.form.toast.successDelete"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("ProviderFeedBackBuilders.form.toast.title"),
          description: t("ProviderFeedBackBuilders.form.toast.error"),
        })
      }

      return result
    },
  })
}
