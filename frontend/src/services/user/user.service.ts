import api from "@/utils/api.ts"
import { User } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

export const getUser = async (id: number) => {
  return api.get(`users/${id}`)
}

export const getUserMe = async () => {
  return api.get(`user/me`)
}

export const updateUser = async (
  id: number,
  data: {
    firstname?: string
    lastname?: string
    email?: string
  }
) => {
  return api.patch(`users/${id}`, data)
}

export function useFetchEmployeesByCompany(companyId: number) {
  return useQuery<User[]>(
    ["getUsers"],
    async () => {
      const response = await api.get(`companies/${companyId}/users`)
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

type EmployeeForm = {
  firstname: string
  lastname: string
  email: string
  agencies?: string[]
  company?: string
}

export const updateEmployeeById = async (agencyId: number, body: EmployeeForm) => {
  return api
    .patch(`employees/${agencyId}`, body, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    })
    .catch((err) => err.response)
}

export const addNewEmployee = async (companyId: number, body: EmployeeForm) => {
  body.company = `/api/companies/${companyId}`
  return api
    .post(`employees`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((err) => err.response)
}
