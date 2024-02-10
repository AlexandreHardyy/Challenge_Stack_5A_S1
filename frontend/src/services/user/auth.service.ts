import { AxiosPromise } from "axios"
import api from "@/utils/api"

export const login = async (user: { email: string; password: string }): Promise<AxiosPromise<{ token: string }>> => {
  return api.post("login", user)
}

export const forgotPassword = async (email: string): Promise<AxiosPromise<null>> => {
  return api.post("forgot_password/", { email })
}

export const resetPassword = async (token: string, password: string): Promise<AxiosPromise<null>> => {
  return api.post(`forgot_password/${token}`, { password })
}

export const register = async (user: {
  firstname: string
  lastname: string
  email: string
  plainPassword: string
}): Promise<{
  id: number
  email: string
  firstname: string
  lastname: string
}> => {
  return api.post("users", user)
}

type providerForm = {
  email: string
  firstname: string
  lastname: string
  company?: string
}

export const addNewProvider = async (body: providerForm, companyId: number) => {
  body.company = `/api/companies/${companyId}`

  return api
    .post(`providers`, body, {
      headers: {
        "Content-Type": "application/ld+json",
      },
    })
    .catch((error) => error.response)
}
