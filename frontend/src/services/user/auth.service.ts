import { AxiosPromise } from "axios"
import axios from "axios"

export const login = async (user: { email: string; password: string }): Promise<AxiosPromise<{ token: string }>> => {
  return axios.post("/login", user)
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
  return axios.post("http://localhost:8888/api/users", user)
}
