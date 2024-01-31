import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { Agency } from "@/utils/types"
import { AgencyFormSchema } from "@/zod-schemas/agency"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export function useFetchAgenciesByCompany(companyId?: number) {
  return useQuery<Agency[]>(
    ["getAgencies"],
    async () => {
      const response = await api.get(`companies/${companyId}/agencies`)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getService)")
      }

      return response.data["hydra:member"]
    },
    {
      retry: false,
    }
  )
}

export function useFetchAgencyById(agencyId?: string) {
  return useQuery<Agency>(["getAgency"], async () => {
    const response = await api.get(`agencies/${agencyId}`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getAgency)")
    }

    return response.data
  })
}

type FetchAgenciesQueryParams = {
  name?: string
  "services.category.name"?: string
  address?: string
  city?: string
  zip?: string
}

export function useFetchAgencies(queryParams?: FetchAgenciesQueryParams, shouldWaitQueryParams = false) {
  let url = "agencies"
  const isQueryParamsDefined = !!(
    queryParams && Object.values(queryParams).find((value) => value !== undefined && value !== "")
  )

  //TODO: add pagination
  if (isQueryParamsDefined) {
    const formatedQueryParams = Object.entries(queryParams)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join("&")

    url += `?${formatedQueryParams}`
  }

  return useQuery({
    queryKey: ["getAgencies"],
    queryFn: async (): Promise<Agency[]> => {
      const response = await api.get(url).catch((err) => err.response)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getAgencies)")
      }
      return response.data["hydra:member"]
    },
    retry: false,
    enabled: shouldWaitQueryParams ? isQueryParamsDefined : undefined,
  })
}

export const useAddAgency = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: AgencyFormSchema) => {
      const result = await api
        .post(`agencies`, body, {
          headers: {
            "Content-Type": "application/ld+json",
          },
        })
        .catch((err) => err.response)
      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("ProviderAgencies.form.toast.title"),
          description: t("ProviderAgencies.form.toast.successCreate"),
        })
      } else {
        const isWrongAddress = result.data["hydra:description"].includes("geoloc")
        toast({
          variant: "destructive",
          title: t("ProviderAgencies.form.toast.title"),
          description: isWrongAddress
            ? t("ProviderAgencies.form.toast.addressError")
            : t("ProviderAgencies.form.toast.error"),
        })
      }

      return result
    },
  })
}

export const useUpdateAgency = (agencyId?: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: AgencyFormSchema) => {
      const result = await api
        .patch(`agencies/${agencyId}`, body, {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        })
        .catch((err) => err.response)

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("ProviderAgencies.form.toast.title"),
          description: t("ProviderAgencies.form.toast.successUpdate"),
        })
      } else {
        const isWrongAddress = result.data["hydra:description"].includes("geoloc")
        toast({
          variant: "destructive",
          title: t("ProviderAgencies.form.toast.title"),
          description: isWrongAddress
            ? t("ProviderAgencies.form.toast.addressError")
            : t("ProviderAgencies.form.toast.error"),
        })
      }

      return result
    },
  })
}

export const useDeleteAgencyById = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (agencyId: number) => {
      const result = await api.delete(`agencies/${agencyId}`).catch((err) => err.response)
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
