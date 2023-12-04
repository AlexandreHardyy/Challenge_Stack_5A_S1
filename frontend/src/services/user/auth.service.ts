import { AxiosPromise } from "axios"
import api from "@/utils/api"

export const login = async (user: { email: string; password: string }): Promise<AxiosPromise<{ token: string }>> => {
  return api.post("http://localhost:8888/api/login", user)
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
  return api.post("http://localhost:8888/api/users", user)
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
