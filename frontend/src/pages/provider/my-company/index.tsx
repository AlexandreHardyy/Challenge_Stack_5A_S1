import { CompanyForm } from "@/components/form/company-form"
import { Spinner } from "@/components/loader/Spinner"
import { useAuth } from "@/context/AuthContext"
import { useFetchCompany } from "@/services/company.service"
import { useTranslation } from "react-i18next"
import CompanyImageUploader from "./company-image-uploader"

import defaultAgencyLogo from "@/assets/img/default-company-logo.svg"

const MyCompany = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const company = useFetchCompany(user?.company?.id)

  if (company.status === "error") {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  if (company.status === "loading") {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl mb-6"> {t("My company")} </h1>
      {company.data.image && (
        <div className="flex justify-center mt-6">
          <div className="border border-black rounded-sm">
            <img
              alt="companylogo"
              className="w-[185px] h-[185px]"
              src={
                company.data.image
                  ? `${import.meta.env.VITE_API_URL_PUBLIC}${company.data.image.contentUrl}`
                  : defaultAgencyLogo
              }
            />
          </div>
        </div>
      )}
      <CompanyImageUploader company={company.data} />
      <CompanyForm company={company.data} isReadOnly={false} />
    </div>
  )
}

export default MyCompany
