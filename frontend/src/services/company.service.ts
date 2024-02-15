import { useMutation, useQuery } from "@tanstack/react-query"
import { Company } from "@/utils/types.ts"
import api from "@/utils/api.ts"
import { toast, useToast } from "@/components/ui/use-toast.ts"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { AddCompanyFormSchema, UpdateCompanyFormSchema } from "@/zod-schemas/company"
import { formatQueryParams } from "@/utils/helpers"

export function useFetchCompany(companyId?: number) {
  const fetchCompanyUrl = `/companies/${companyId}`

  return useQuery<Company>(
    ["getCompany", fetchCompanyUrl],
    async () => {
      const response = await api.get(fetchCompanyUrl)
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: t("provider.dashboard.toast.error"),
        })
      }
      return response.data
    },
    {
      retry: false,
    }
  )
}

export function useFetchCompanies(
  queryParams?: { socialReason?: string; ["categories.name"]?: string; page: string },
  shouldWaitQueryParams = false
) {
  const formatedQueryParams = formatQueryParams(queryParams)
  const url = formatedQueryParams ? `companies${formatedQueryParams}` : "companies"

  return useQuery({
    queryKey: ["companies", url],
    queryFn: async ({ queryKey }): Promise<Company[]> => {
      const [, url] = queryKey
      const response = await api.get(url)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getCompanies)")
      }
      return response.data["hydra:member"]
    },
    enabled: shouldWaitQueryParams ? !!formatedQueryParams : undefined,
  })

  // return useQuery<Company[]>(
  //   ["getCompanies"],
  //   async (queryParams) => {

  //     const response = await api.get("companies")
  //     if (response.status !== 200) {
  //       throw new Error("Something went wrong with the request (getCompanies)")
  //     }
  //     return response.data["hydra:member"]
  //   },
  //   {
  //     retry: false,
  //   }
  // )
}

export const useAddCompany = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: AddCompanyFormSchema) => {
      const result = await api
        .post(`companies`, body, {
          headers: {
            "Content-Type": "application/ld+json",
          },
        })
        .catch((err) => err.response)
      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("admin.companies.toast.success.title"),
          description: t("admin.companies.toast.success.create"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("admin.companies.toast.error.title"),
          description: t("admin.companies.toast.error.error"),
        })
      }

      return result
    },
  })
}

export const useUpdateCompany = (companyId?: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: UpdateCompanyFormSchema) => {
      const result = await api
        .patch(`companies/${companyId}`, body, {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        })
        .catch((err) => err.response)

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("admin.companies.toast.update.title"),
          description: t("admin.companies.toast.update.update"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("admin.companies.toast.error.title"),
          description: t("admin.companies.toast.error.error"),
        })
      }

      return result
    },
  })
}

export const useDeleteCompanyById = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (companyId: number) => {
      const result = await api.delete(`companies/${companyId}`).catch((err) => err.response)
      if (result.status === 204) {
        toast({
          variant: "success",
          title: t("ProviderAgencies.form.toast.title"),
          description: t("ProviderAgencies.form.toast.successDelete"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("ProviderAgencies.form.toast.title"),
          description: t("ProviderAgencies.form.toast.error"),
        })
      }

      return result
    },
  })
}
