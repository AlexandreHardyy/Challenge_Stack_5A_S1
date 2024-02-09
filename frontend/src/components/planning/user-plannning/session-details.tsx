import { DateTime } from "luxon"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Session } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import CancelSessionModal from "../cancel-session-modal"

export function SessionDetails({ session }: { session?: Session }) {
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = DateTime.now()

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

  const sessionStartDate = DateTime.fromISO(session.startDate)

  return (
    <>
      <CancelSessionModal session={session} isModalOpen={isModalOpen} onModalOpenChange={setIsModalOpen} />
      <Card className="w-1/4 mt-[66px] ml-3 flex flex-col">
        <CardHeader>
          <CardTitle>{session.service.name}</CardTitle>
          <CardDescription>
            {t("provider.myPlanning.sessionDetails.agency")}: {session.agency.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex grow flex-col gap-4">
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
            <p className="font-bold">{t("provider.myPlanning.sessionDetails.instructorDetails")}:</p>
            <p>
              {t("provider.myPlanning.sessionDetails.firstname")}: {session.instructor.firstname}
            </p>
            <p>
              {t("provider.myPlanning.sessionDetails.lastname")}: {session.instructor.lastname}
            </p>
            <p>
              {t("provider.myPlanning.sessionDetails.mail")}: {session.instructor.email}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {today < sessionStartDate && session.status !== "cancelled" && (
            <Button size="lg" variant="destructive" onClick={() => setIsModalOpen(true)}>
              {t("common.cta.cancel")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}
