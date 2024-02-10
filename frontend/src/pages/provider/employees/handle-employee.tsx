import { Spinner } from "@/components/loader/Spinner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useFetchUserById } from "@/services/user/user.service"

import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { FormSchedules } from "@/pages/provider/employees/form"
import { Employee, Session } from "@/utils/types"
import { useState } from "react"
import { SessionDetails } from "../../../components/planning/employee-planning/session-details"
import EmployeeCalendar from "@/components/planning/employee-planning/employee-calendar"

const HandleEmployee = () => {
  const { userId } = useParams()
  const { t } = useTranslation()
  const [selectedSession, setSelectedSession] = useState<Session>()

  const { data, isLoading, isFetching, isError } = useFetchUserById(Number(userId))
  const employee = data as Employee

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
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl"> {t("employeePage.title")} </h1>
      <Card className="">
        <CardHeader>
          <div className="text-xl font-semibold">
            {employee.lastname} {employee.firstname}
          </div>
        </CardHeader>
        <CardContent>
          <p> {employee?.email} </p>
          <p> {employee?.lastname} </p>
          <p> {employee?.firstname} </p>
          <div>
            <h1 className="text-xl font-semibold mt-6"> {t("employeePage.subTitle")} </h1>
            <p className="text-gray-400 mb-4">{t("employeePage.form.info")}</p>
            <FormSchedules agenciesAvalaibles={employee.agencies} />
          </div>
        </CardContent>
      </Card>
      <div className="flex">
        <EmployeeCalendar setSelectedSession={setSelectedSession} instructor={employee} />
        <SessionDetails session={selectedSession} />
      </div>
    </div>
  )
}

export default HandleEmployee
