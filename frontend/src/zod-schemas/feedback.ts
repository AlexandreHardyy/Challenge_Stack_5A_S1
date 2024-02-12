import { z } from "zod"

export const feedbackFormSchema = z.object({
  feedbackGroups: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  company: z.string(),
  session: z.string(),
  feedBackBuilder: z.string(),
  client: z.string(),
})

export type FeedbackFormSchema = z.infer<typeof feedbackFormSchema>
