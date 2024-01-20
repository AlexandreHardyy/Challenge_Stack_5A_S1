import { z } from "zod"

export const serviceFormSchema = z.object({
  name: z.string().min(1),
  duration: z.string().min(1),
  price: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
})

export type ServiceFormSchema = z.infer<typeof serviceFormSchema>
