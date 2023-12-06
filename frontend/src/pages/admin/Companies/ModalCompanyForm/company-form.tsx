import * as z from "zod"
import { t } from "i18next"
import { Company } from "@/utils/types.ts"
import { addNewCompany, updateCompanyById, useFetchCompanies } from "@/services"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast.ts"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Button } from "@/components/ui/button.tsx"

const companyFormSchema = z.object({
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
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export default function CompanyForm({ company, isReadOnly }: { company?: Company; isReadOnly: boolean }) {
  const companies = useFetchCompanies()
  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      socialReason: company?.socialReason ?? "",
      email: company?.email ?? "",
      phoneNumber: company?.phoneNumber ?? "",
      description: company?.description ?? "",
      siren: company?.siren ?? "",
      isVerified: company?.isVerified ?? false,
      createdAt: company?.createdAt ?? new Date().toISOString(),
      updatedAt: company?.updatedAt ?? new Date().toISOString(),
    },
  })

  const onSubmit = async (values: z.infer<typeof companyFormSchema>) => {
    const result = await (!company ? addNewCompany(values) : updateCompanyById(company!.id, values))
    if (result.status === 201) {
      toast({
        variant: "success",
        title: t("admin.companies.toast.success.title"),
        description: t("admin.companies.toast.success.create"),
      })
      companies?.refetch()
    } else if (result.status === 200) {
      toast({
        variant: "success",
        title: t("admin.companies.toast.update.title"),
        description: t("admin.companies.toast.update.update"),
      })
      companies?.refetch()
    } else {
      toast({
        variant: "destructive",
        title: t("admin.companies.toast.error.title"),
        description: t("admin.companies.toast.error.error"),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="socialReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.companies.table.socialReason")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.companies.table.socialReason")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.companies.table.email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.companies.table.email")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.companies.table.phoneNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.companies.table.phoneNumber")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.companies.table.description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.companies.table.description")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="siren"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.companies.table.sirenNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.companies.table.sirenNumber")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormLabel>{t("admin.companies.table.isVerifiedLabel")}</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isReadOnly && (
          <Button type="submit">{company ? t("admin.companies.cta.edit") : t("admin.companies.cta.add")}</Button>
        )}
      </form>
    </Form>
  )
}
