import api from "@/utils/api"
import { Agency } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

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
  const url = `${import.meta.env.VITE_API_URL}agencies/${agencyId}`

  return useQuery<Agency>(
    ["getAgency", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getAgency)")
      }

      return response.json()
    },
    {
      retry: false,
    }
  )
}

type AgencyForm = {
  name: string
  address: string
  city: string
  zip: string
  services: string[]
  company?: string
  createdAt?: string
  updatedAt?: string
}

export const updateAgencyById = async (agencyId: number, body: AgencyForm) => {
  return api
    .patch(`agencies/${agencyId}`, body, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    })
    .catch((err) => err.response)
}

export const addNewAgency = async (companyId: number, body: AgencyForm) => {
  body.company = `/api/companies/${companyId}`

  return api
    .post(`agencies`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((err) => err.response)
}
