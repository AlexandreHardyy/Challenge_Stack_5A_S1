import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { Service } from "@/utils/types"
import { serviceFormSchema } from "@/zod-schemas/service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { z } from "zod"

export function useFetchService(serviceId?: string) {
  const url = `${import.meta.env.VITE_API_URL}services/${serviceId}`

  return useQuery<Service>(
    ["getService", url],
    async () => {
      const response = await api.get(url)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getService)")
      }

      return response.data
    },
    {
      retry: false,
    }
  )
}

export function useCreateService() {
  const { t } = useTranslation()
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (params: z.infer<typeof serviceFormSchema>) => {
      const result = await api.post("services", {
        ...params,
        duration: Number(params.duration),
        price: Number(params.price),
      })

      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.successCreate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.error"),
        })
      }

      return result
    },
  })
}

export function useUpdateService(serviceId: number | undefined) {
  const { t } = useTranslation()
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (service: z.infer<typeof serviceFormSchema>) => {
      const result = await api.patch(
        `services/${serviceId}`,
        {
          ...service,
          duration: Number(service.duration),
          price: Number(service.price),
        },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        }
      )

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.error"),
        })
      }

      return result
    },
  })
}

export const useDeleteServiceById = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await api.delete(`services/${categoryId}`).catch((err) => err.response)
      if (result.status === 204) {
        toast({
          variant: "success",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.successDelete"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastService.title"),
          description: t("providerService.form.toastService.error"),
        })
      }

      return result
    },
  })
}
