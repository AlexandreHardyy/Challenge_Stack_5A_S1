import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type CompanyCardProps = {
  company: Company
}

function CompanyCard({ company }: CompanyCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="flex items-center">
      <div className="py-2 pl-2">
        <img
          alt="companylogo"
          className="rounded-[92px] w-[92px] h-[92px]"
          src="https://www.autoecole-du-griffe.fr/images/logo_auto-ecole_griffe__large.png"
        />
      </div>
      <Link to={`/companies/${company.id}`}>
        <div>
          <CardHeader>
            <CardTitle>{company.socialReason}</CardTitle>
            <CardDescription>
              {t("searchClient.list.companyCard.email")}: {company.email} |{" "}
              {t("searchClient.list.companyCard.phoneNumber")}: {company.phoneNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>{company.description}</CardContent>
        </div>
      </Link>
    </Card>
  )
}

export default CompanyCard
