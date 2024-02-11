import { z } from "zod"

export const feedBackBuilderFormSchema = z.object({
  title: z.string().min(1),
  isSelected: z.boolean(),
  questions: z.array(z.string()),
  company: z.string().optional(),
})

export type FeedBackBuilderFormSchema = z.infer<typeof feedBackBuilderFormSchema>
