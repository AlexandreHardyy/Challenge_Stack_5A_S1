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

export function useFetchUserById(id: number) {
  return useQuery<User>(["getUserById"], async () => {
    const response = await api.get(`users/${id}`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getUserById)")
    }

    return response.data
  })
}

export function useFetchEmployeesByCompany(companyId?: number) {
  return useQuery<User[]>(["getUsers"], async () => {
    const response = await api.get(`companies/${companyId}/users`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getUsers)")
    }

    return response.data["hydra:member"]
  })
}

export function useFetchUsers() {
  return useQuery<User[]>(["getUsers"], async () => {
    const response = await api.get(`users`)
    if (response.status !== 200) {
      throw new Error("Something went wrong with the request (getUsers)")
    }

    return response.data["hydra:member"]
  })
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

export const addNewEmployee = async (companyId: number | undefined, body: EmployeeForm) => {
  body.company = `/api/companies/${companyId}`
  return api
    .post(`employees`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((err) => err.response)
}

type UserForm = {
  firstname: string
  lastname: string
  email: string
  roles: string[]
  isVerified: boolean
  updatedAt?: string
}

export const addNewUser = async (body: UserForm) => {
  return api
    .post(`users`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((err) => err.response)
}

export const updateUserById = async (userId: number, body: UserForm) => {
  return api
    .patch(`users/${userId}`, body, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    })
    .catch((err) => err.response)
}
