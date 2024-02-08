import { z } from "zod"

export const agencyAdminFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
})

export type AgencyFormSchema = z.infer<typeof agencyAdminFormSchema>
