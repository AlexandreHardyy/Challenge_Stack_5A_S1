import api from "@/utils/api"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Category } from "@/utils/types"
import { CategoryFormSchema } from "@/zod-schemas/category"

export function useFetchServicesGroupByCategory(companyId?: number) {
  return useQuery<Category[]>(["getCategories"], async () => {
    const response = await api.get(`companies/${companyId}/categories`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getCategories)")
    }

    const res = await response.data
    return res["hydra:member"]
  })
}

export const useAddCategory = (companyId: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: CategoryFormSchema) => {
      const result = await api.post("categories", {
        ...body,
        company: `/api/companies/${companyId}`,
      })

      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.successCreate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.error"),
        })
      }

      return result
    },
  })
}

export const useUpdateCategory = (categoryId: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: CategoryFormSchema) => {
      const result = await api
        .patch(`categories/${categoryId}`, body, {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        })
        .catch((err) => err.response)

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.error"),
        })
      }

      return result
    },
  })
}

export const useDeleteCategoryById = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await api.delete(`categories/${categoryId}`).catch((err) => err.response)
      if (result.status === 204) {
        toast({
          variant: "success",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.successDelete"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("providerService.form.toastCategory.title"),
          description: t("providerService.form.toastCategory.error"),
        })
      }

      return result
    },
  })
}
