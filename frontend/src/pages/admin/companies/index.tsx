import { DataTable } from "@/components/Table"
import { ColumnDef } from "@tanstack/react-table"
import { useDeleteCompanyById, useFetchCompanies } from "@/services/company.service"
import { Company } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EyeIcon, PencilIcon } from "lucide-react"
import { useState } from "react"
import { CompanyForm } from "@/components/form/company-form"
import { Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { DeleteModal } from "@/components/delete-modal"

const ModalCompanyForm = ({
  company,
  variant = "ghost",
}: {
  company?: Omit<Company, "users">
  variant?: "ghost" | "outline"
}) => {
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
              <div className="flex items-center">
                <h2>{t("admin.companies.table.company")}</h2>
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                    <PencilIcon />
                  </Button>
                )}{" "}
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            <CompanyForm company={company} isReadOnly={isReadOnly} isAdmin={true} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const ActionColumn = ({ company }: { company: Omit<Company, "users"> }) => {
  const queryClient = useQueryClient()
  const deleteCompany = useDeleteCompanyById()
  return (
    <div className="flex items-center gap-4">
      <Link to={`/admin/companies/${company.id}`}>
        <EyeIcon />
      </Link>
      <ModalCompanyForm company={company} />
      <DeleteModal
        name={company.socialReason}
        onDelete={async () => {
          await deleteCompany.mutateAsync(company.id)
          queryClient.invalidateQueries(["companies"])
        }}
      />
    </div>
  )
}

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "socialReason",
    header: () => t("admin.companies.table.socialReason"),
  },
  {
    accessorKey: "email",
    header: () => t("admin.companies.table.email"),
  },
  {
    accessorKey: "phoneNumber",
    header: () => t("admin.companies.table.phoneNumber"),
  },
  {
    accessorKey: "description",
    header: () => t("admin.companies.table.description"),
  },
  {
    accessorKey: "siren",
    header: () => t("admin.companies.table.sirenNumber"),
  },
  {
    accessorKey: "isVerified",
    header: () => t("admin.companies.table.isVerified"),
  },
  {
    accessorKey: "createdAt",
    header: () => t("admin.companies.table.createdAt"),
    cell: ({ row: { original: company } }) => formatDate(company.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: () => t("admin.companies.table.updatedAt"),
    cell: ({ row: { original: company } }) => formatDate(company.updatedAt),
  },
  {
    accessorKey: "action",
    header: () => t("admin.companies.table.actions"),
    cell: ({ row: { original: company } }) => {
      return <ActionColumn company={company} />
    },
  },
]

const Companies = () => {
  const { t } = useTranslation()
  const companies = useFetchCompanies()

  if (companies.isError) {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (companies.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("admin.companies.title")}</h1>
      <div className="self-start w-full max-w-xl">
        <ModalCompanyForm variant="outline" />
      </div>
      <DataTable isLoading={companies.isLoading} columns={columns} data={companies.data} />
    </div>
  )
}

export default Companies
