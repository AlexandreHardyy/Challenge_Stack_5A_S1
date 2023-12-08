import api from "@/utils/api"
import { Session } from "@/utils/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"

export function useFetchSessionsByAgencyService(agencyId?: string, serviceId?: string) {
  // return useQuery<Session[]>(
  //   ["getSessions"],
  //   async () => {
  //     const response = await api.get(`sessions/?agency=${agencyId}&service=${serviceId}`)
  //     if (response.status !== 200) {
  //       throw new Error("Something went wrong with the request (getSessions)")
  //     }

  //     return response.data["hydra:member"]
  //   },
  //   {
  //     retry: false,
  //   }
  // )

  if (!agencyId || !serviceId) {
    throw new Error("agency and service must be specifief")
  }

  const url = `${import.meta.env.VITE_API_URL}sessions?agency=${agencyId}&service=${serviceId}&status=created`

  return useQuery<Session[]>(
    ["getSessions", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getSessions)")
      }

      const res = await response.json()
      return res["hydra:member"]
    },
    {
      retry: false,
    }
  )
}

interface SessionForm {
  student: string
  instructor: string
  service: string
  agency: string
  startDate: DateTime
  endDate: DateTime
  status: string
}

export function useAddSession({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  return useMutation({
    mutationFn: async (body: SessionForm) =>
      await api
        .post<Session>(`sessions`, body, {
          headers: {
            "Content-Type": "application/ld+json",
          },
        })
        .catch((err) => err.response),
    onSuccess,
    onError,
    retry: false,
  })

  // const response = await fetch(url,{
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(body)
  // })
  // if (!response.ok) {
  //   throw new Error("Something went wrong with the request (postService)")
  // }

  // return response.json()
}
