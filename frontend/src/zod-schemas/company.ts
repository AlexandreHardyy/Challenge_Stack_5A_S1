import { z } from "zod"
import { t } from "i18next"

export const companyFormSchema = z.object({
  socialReason: z.string().min(2, {
    message: t("admin.companies.table.errors.socialReason"),
  }),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^(\+33|0)[1-9]([-. ]?\d{2}){4}$/, {
    message: t("admin.companies.table.errors.phoneNumber"),
  }),
  description: z.string().min(2, {
    message: t("admin.companies.table.errors.description"),
  }),
  siren: z.string().regex(/^\d{9}$/, {
    message: t("admin.companies.table.errors.sirenNumberRegExp"),
  }),
  agencies: z.array(z.string()).optional(),
  isVerified: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CompanyFormSchema = z.infer<typeof companyFormSchema>
