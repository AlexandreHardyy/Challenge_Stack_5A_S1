import { Service } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

export function useFetchServicesByCompany(companyId: number) {
  const url = `${import.meta.env.VITE_API_URL}companies/${companyId}/categories`

  return useQuery<Service[]>(
    ["getServices", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getService)")
      }

      const res = await response.json()
      return res["hydra:member"]
    },
    {
      retry: false,
    }
  )
}

export function useFetchService(serviceId?: string) {
  const url = `${import.meta.env.VITE_API_URL}services/${serviceId}`

  return useQuery<Service>(
    ["getService", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getService)")
      }

      return response.json()
    },
    {
      retry: false,
    }
  )
}
