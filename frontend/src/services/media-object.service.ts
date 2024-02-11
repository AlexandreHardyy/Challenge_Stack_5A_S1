import api from "@/utils/api.ts"

export const postMedia = async (formData: FormData) => {
  return api.post("media_objects", formData)
}
