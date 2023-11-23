import api from "@/utils/api.ts"

export const getUser = async (id: number) => {
  return api.get(`user/${id}`)
}
