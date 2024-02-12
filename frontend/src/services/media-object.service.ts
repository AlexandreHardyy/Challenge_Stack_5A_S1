import api from "@/utils/api.ts"
import { MediaObject } from "@/utils/types"

export const postMedia = async (formData: FormData) => {
  return api.post<MediaObject>("media_objects", formData)
}
