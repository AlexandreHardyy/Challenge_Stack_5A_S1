import api from "@/utils/api.ts"

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
