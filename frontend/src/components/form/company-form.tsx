import { t } from "i18next"
import { Company } from "@/utils/types.ts"
import { useAddCompany, useUpdateCompany } from "@/services/company.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Button } from "@/components/ui/button.tsx"
import { AddCompanyFormSchema, addCompanyFormSchema } from "@/zod-schemas/company"
import { useQueryClient } from "@tanstack/react-query"

type CompanyFormProps = {
  company?: Omit<Company, "users">
  isReadOnly?: boolean
  isAdmin?: boolean
}

export const CompanyForm = ({ company, isReadOnly = false, isAdmin = false }: CompanyFormProps) => {
  const queryClient = useQueryClient()
  const addCompany = useAddCompany()
  const updateCompany = useUpdateCompany(company!.id)

  const form = useForm<AddCompanyFormSchema>({
    resolver: zodResolver(addCompanyFormSchema),
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

  const onSubmit = async (values: AddCompanyFormSchema) => {
    const body = isAdmin ? values : { ...values, isVerified: undefined }
    const result = await (!company ? addCompany.mutateAsync(values) : updateCompany.mutateAsync(body))
    if (result.status === 201 || result.status === 200) {
      queryClient.invalidateQueries(["getCompanies"])
      queryClient.invalidateQueries(["companies"])
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
        {isAdmin && (
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
        )}

        {!isReadOnly && (
          <Button type="submit">{company ? t("admin.companies.cta.edit") : t("admin.companies.cta.add")}</Button>
        )}
      </form>
    </Form>
  )
}
