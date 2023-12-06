import { useQuery } from "@tanstack/react-query"
import { Company } from "@/utils/types.ts"
import api from "@/utils/api.ts"
import { toast } from "@/components/ui/use-toast.ts"
import { t } from "i18next"

export function useFetchCompany(companyId?: number) {
  const fetchCompanyUrl = `${import.meta.env.VITE_API_URL}companies/${companyId}`

  return useQuery<Company>(
    ["getCompany", fetchCompanyUrl],
    async () => {
      const response = await api.get(fetchCompanyUrl)
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: t("provider.homeProvider.toast.error"),
        })
      }
      return response.data
    },
    {
      retry: false,
    }
  )
}

export function useFetchCompanies() {
  return useQuery<Company[]>(
    ["getCompanies"],
    async () => {
      const response = await api.get(`companies`)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getCompanies)")
      }
      return response.data["hydra:member"]
    },
    {
      retry: false,
    }
  )
}

type companyForm = {
  socialReason: string
  description: string
  email: string
  phoneNumber: string
  siren: string
  createdAt?: string
  updatedAt?: string
}

export const addNewCompany = async (body: companyForm) => {
  return api
    .post(`companies`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((error) => error.response)
}

export const updateCompanyById = async (companyId: number, body: companyForm) => {
  return api
    .patch(`companies/${companyId}`, body, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    })
    .catch((error) => error.response)
}
