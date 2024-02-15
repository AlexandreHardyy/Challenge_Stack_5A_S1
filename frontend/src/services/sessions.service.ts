import api from "@/utils/api"
import { formatQueryParams } from "@/utils/helpers"
import { Session } from "@/utils/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"

export function useFetchSessionById(id?: number) {
  return useQuery<Session>(["getSessionById", id], async ({ queryKey: [, sessionId] }) => {
    const response = await api.get(`sessions/${sessionId}`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getSessionById)")
    }

    return response.data
  })
}

type useFetchSessionsQueryParams = {
  agency?: string | string[]
  status?: "created" | "cancelled"
  "startDate[after]"?: string
}

export function useFetchSessions(queryParams?: useFetchSessionsQueryParams) {
  const formatedQueryParams = formatQueryParams(queryParams)
  const url = `sessions${formatedQueryParams}`

  return useQuery<Session[]>(["getSessions"], async () => {
    const response = await api.get(url)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getSessions)")
    }

    return response.data["hydra:member"]
  })
}

export function useFetchSessionsByInstructor(userId?: number) {
  return useQuery<Session[]>(["getSessionsByInstructor"], async () => {
    const response = await api.get(`instructors/${userId}/sessions`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getSessions)")
    }

    return response.data["hydra:member"]
  })
}

export function useFetchSessionsByStudent(userId?: number) {
  return useQuery<Session[]>(["getSessionsByStudent"], async () => {
    const response = await api.get(`students/${userId}/sessions`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getSessions)")
    }

    return response.data["hydra:member"]
  })
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
}

export function useUpdateSession({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  return useMutation({
    mutationFn: async (params: { id: number; status?: string; studentMark?: number }) =>
      await api
        .patch<Session>(
          `sessions/${params.id}`,
          {
            status: params.status,
            studentMark: params.studentMark,
          },
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
