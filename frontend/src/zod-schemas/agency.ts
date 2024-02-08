import { z } from "zod"

export const agencyFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  services: z.array(z.string()),
  company: z.string().optional(),
})

export type AgencyFormSchema = z.infer<typeof agencyFormSchema>
