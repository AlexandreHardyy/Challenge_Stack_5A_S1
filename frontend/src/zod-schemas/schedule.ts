import { z } from "zod"

export const scheduleFormSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.optional(z.date()),
  }),
  startHour: z.string(),
  endHour: z.string(),
  agencyId: z.number(),
  employeeId: z.number(),
})

export type ScheduleFormSchema = z.infer<typeof scheduleFormSchema>
