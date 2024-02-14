import { Spinner } from "@/components/loader/Spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useFetchCompany } from "@/services/company.service"
import { useParams } from "react-router-dom"
import AdminAgenciesList from "./agencies-list"
import AdminEmployeesList from "./employees-list"
import { useTranslation } from "react-i18next"

import defaultAgencyLogo from "@/assets/img/default-company-logo.svg"
import { formatDate } from "@/utils/helpers.ts"

function CompanyDetails() {
  const { t } = useTranslation()
  const { companyId } = useParams()

  const companyRequest = useFetchCompany(parseInt(companyId ?? ""))

  if (companyRequest.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  if (companyRequest.status === "loading") {
    return (
      <div className="flex justify-center items-center w-full h-screen gap-3">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex gap-4 h-screen pb-10">
      <Card className="flex flex-col w-1/3 h-full">
        <CardHeader>
          <CardTitle>{t("admin.companies.table.companyDetails.mainInformations")}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grow">
          <div className="flex justify-center mt-6">
            <div className="border border-black rounded-sm">
              <img
                alt="companylogo"
                className="w-[185px] h-[185px]"
                src={
                  companyRequest.data.image
                    ? `${import.meta.env.VITE_API_URL_PUBLIC}${companyRequest.data.image?.contentUrl}`
                    : defaultAgencyLogo
                }
              />
            </div>
          </div>
          <div className="mt-6">
            <p>
              {t("admin.companies.table.socialReason")}: {companyRequest.data.socialReason}
            </p>
            <p>
              {t("admin.companies.table.email")}: {companyRequest.data.email}
            </p>
            <p>
              {t("admin.companies.table.phoneNumber")}: {companyRequest.data.phoneNumber}
            </p>
            <p>
              {t("admin.companies.table.isVerified")}: {companyRequest.data.isVerified ? "true" : "false"}
            </p>
            <p>
              {t("admin.companies.table.sirenNumber")}: {companyRequest.data.siren}
            </p>
            <p>
              {t("admin.companies.table.createdAt")}: {formatDate(companyRequest.data.createdAt)}
            </p>
            <p>
              {t("admin.companies.table.description")}: {companyRequest.data.description}
            </p>
          </div>
        </CardContent>
        <Separator />
      </Card>
      <div className="grow gap-4 flex flex-col">
        <AdminAgenciesList agencies={companyRequest.data.agencies} />
        <AdminEmployeesList employees={companyRequest.data.users} />
      </div>
    </div>
  )
}

export default CompanyDetails
