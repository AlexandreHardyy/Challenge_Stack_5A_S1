import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { useFetchCompanies } from "@/services"
import { Company } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import ModalCompanyForm from "@/pages/admin/Companies/ModalCompanyForm"

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
          <ModalCompanyForm
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
        <ModalCompanyForm variant="outline" />
      </div>
      <DataTable isLoading={companiesRequest.isLoading} columns={companiesColumns(t)} data={formattedCompanies} />
    </div>
  )
}

export default Companies
