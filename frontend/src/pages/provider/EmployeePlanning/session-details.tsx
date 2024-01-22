import { DateTime } from "luxon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Session } from "@/utils/types"
import { useTranslation } from "react-i18next"

export function SessionDetails({ session }: { session?: Session }) {
  const { t } = useTranslation()

  if (!session) {
    return (
      <Card className="w-1/4 mt-[66px] ml-3 flex justify-center items-center">
        <CardContent className="">
          <h3 className="font-bold text-[24px] text-center">
            {t("provider.myPlanning.sessionDetails.noSessionSelected")}
          </h3>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-1/4 mt-[66px] ml-3">
      <CardHeader>
        <CardTitle>{session.service.name}</CardTitle>
        <CardDescription>
          {t("provider.myPlanning.sessionDetails.agency")}: {session.agency.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="font-bold">
            {t("provider.myPlanning.sessionDetails.date")}: {DateTime.fromISO(session.startDate).toLocaleString()}
          </p>
          <p>
            {DateTime.fromISO(session.startDate).toLocaleString(DateTime.TIME_SIMPLE)} -{" "}
            {DateTime.fromISO(session.endDate).toLocaleString(DateTime.TIME_SIMPLE)}
          </p>
        </div>
        <div>
          <p className="font-bold">{t("provider.myPlanning.sessionDetails.studentDetails")}:</p>
          <p>
            {t("provider.myPlanning.sessionDetails.firstname")}: {session.student.firstname}
          </p>
          <p>
            {t("provider.myPlanning.sessionDetails.lastname")}: {session.student.lastname}
          </p>
          <p>
            {t("provider.myPlanning.sessionDetails.mail")}: {session.student.email}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
