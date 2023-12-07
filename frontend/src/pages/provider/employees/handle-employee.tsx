import { Spinner } from "@/components/loader/Spinner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useFetchUserById } from "@/services"

import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { FormSchedules } from "@/pages/provider/employees/form"

const HandleEmployee = () => {
  const { userId } = useParams()
  const { t } = useTranslation()

  const { data: employee, isLoading, isFetching, isError } = useFetchUserById(Number(userId))

  if (isLoading || isFetching) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <div> {t("employeePage.fetchError")} </div>
  }

  return (
    <div>
      <h1 className="text-4xl mb-8"> {t("employeePage.title")} </h1>

      <Card>
        <CardHeader>
          {" "}
          <div className="text-xl font-semibold">
            {employee.lastname} {employee.firstname}
          </div>{" "}
        </CardHeader>
        <CardContent>
          <p> {employee?.email} </p>
          <p> {employee?.lastname} </p>
          <p> {employee?.firstname} </p>

          <div>
            <h1 className="text-xl font-semibold mt-6"> {t("employeePage.subTitle")} </h1>

            <p className="text-gray-400 mb-4">{t("employeePage.form.info")}</p>
            <FormSchedules />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HandleEmployee
