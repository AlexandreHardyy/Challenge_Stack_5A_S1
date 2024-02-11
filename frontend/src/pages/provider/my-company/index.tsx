import { CompanyForm } from "@/components/form/company-form"
import { Spinner } from "@/components/loader/Spinner"
import { useAuth } from "@/context/AuthContext"
import { useFetchCompany } from "@/services/company.service"
import { useTranslation } from "react-i18next"

const MyCompany = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const company = useFetchCompany(user?.company?.id)

  if (company.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl mb-6"> {t("My company")} </h1>
      <CompanyForm company={company.data} isReadOnly={false} />
    </div>
  )
}

export default MyCompany
