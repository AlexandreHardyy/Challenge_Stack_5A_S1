import api from "@/utils/api"
import { formatQueryParams } from "@/utils/helpers"
import { Session } from "@/utils/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"

type useFetchSessionsByAgencyQueryParams = {
  status?: "created" | "cancelled"
  "startDate[after]"?: string
}

export function useFetchSessionsByAgency(agencyId?: string, queryParams?: useFetchSessionsByAgencyQueryParams) {
  const formatedQueryParams = formatQueryParams(queryParams)
  const url = formatedQueryParams ? `sessions${formatedQueryParams}&agency=${agencyId}` : `sessions?agency=${agencyId}`

  return useQuery<Session[]>(
    ["getSessions"],
    async () => {
      const response = await api.get(url)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getSessions)")
      }

      return response.data["hydra:member"]
    },
    {
      retry: false,
    }
  )

  // const url = `${import.meta.env.VITE_API_URL}sessions?agency=${agencyId}&status=created`

  // return useQuery<Session[]>(
  //   ["getSessions", url],
  //   async () => {
  //     const response = await fetch(url)
  //     if (!response.ok) {
  //       throw new Error("Something went wrong with the request (getSessions)")
  //     }

  //     const res = await response.json()
  //     return res["hydra:member"]
  //   },
  //   {
  //     retry: false,
  //   }
  // )
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
        .catch((err) => {
          throw new Error(err.response)
        }),
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

export function useUpdateSessionStatus({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  return useMutation({
    mutationFn: async (params: { id: number; status: string }) =>
      await api
        .patch<Session>(
          `sessions/${params.id}`,
          { status: params.status },
          {
            headers: {
              "Content-Type": "application/merge-patch+json",
            },
          }
        )
        .catch((err) => {
          throw new Error(err.response)
        }),
    onSuccess,
    onError,
    retry: false,
  })
}
