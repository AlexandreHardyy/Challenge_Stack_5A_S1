import { DataTable } from "@/components/Table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { ColumnDef } from "@tanstack/react-table"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { addNewCompany, updateCompanyById, useFetchCompanies } from "@/services"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Company } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { toast } from "@/components/ui/use-toast.ts"
import { t, TFunction } from "i18next"
import { useTranslation } from "react-i18next"

function companiesColumns(t: TFunction<"translation", undefined>): ColumnDef<Company>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => column.toggleVisibility(false),
    },
    {
      accessorKey: "socialReason",
      header: t("admin.companies.table.socialReason"),
    },
    {
      accessorKey: "email",
      header: t("admin.companies.table.email"),
    },
    {
      accessorKey: "phoneNumber",
      header: t("admin.companies.table.phoneNumber"),
    },
    {
      accessorKey: "description",
      header: t("admin.companies.table.description"),
    },
    {
      accessorKey: "siren",
      header: t("admin.companies.table.sirenNumber"),
    },
    {
      accessorKey: "isVerified",
      header: t("admin.companies.table.isVerified"),
    },
    {
      accessorKey: "createdAt",
      header: t("admin.companies.table.createdAt"),
    },
    {
      accessorKey: "updatedAt",
      header: t("admin.companies.table.updatedAt"),
    },
    {
      accessorKey: "actions",
      header: t("admin.companies.table.actions"),
      cell: ({ row: { getValue: val } }) => {
        return (
          <ModalFormCompany
            company={{
              id: val("id"),
              socialReason: val("socialReason"),
              email: val("email"),
              phoneNumber: val("phoneNumber"),
              description: val("description"),
              siren: val("siren"),
              agencies: val("agencies"),
              isVerified: val("isVerified"),
              createdAt: val("createdAt"),
              updatedAt: val("updatedAt"),
            }}
          />
        )
      },
    },
  ]
}

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

const CompanyForm = ({ company, isReadOnly }: { company?: Company; isReadOnly: boolean }) => {
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

const ModalFormCompany = ({ company, variant = "ghost" }: { company?: Company; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsReadOnly] = useState(!!company)
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!company)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!company ? t("admin.companies.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!company ? (
              t("admin.companies.cta.new")
            ) : (
              <>
                <div className="flex items-center">
                  <h2>{t("admin.companies.table.company")}</h2>
                  {isReadOnly && (
                    <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                      <PencilIcon />
                    </Button>
                  )}{" "}
                </div>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <CompanyForm company={company} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const Companies = () => {
  const { t } = useTranslation()
  const companiesRequest = useFetchCompanies()

  if (companiesRequest.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (companiesRequest.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  const companies: Company[] = companiesRequest.data

  const formattedCompanies: Company[] = companies.map((company: Company) => ({
    ...company,
    createdAt: formatDate(company.createdAt),
    updatedAt: formatDate(company.updatedAt),
  }))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("admin.companies.title")}</h1>
      <div className="self-start w-full max-w-xl">
        <ModalFormCompany variant="outline" />
      </div>
      <DataTable isLoading={companiesRequest.isLoading} columns={companiesColumns(t)} data={formattedCompanies} />
    </div>
  )
}

export default Companies
