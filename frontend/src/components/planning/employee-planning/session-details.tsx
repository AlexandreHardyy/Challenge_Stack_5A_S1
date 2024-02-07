import { DateTime } from "luxon"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Session } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Rating } from "react-simple-star-rating"
import CancelSessionModal from "@/components/planning/cancel-session-modal"
import { useUpdateSession } from "@/services/sessions.service"
import { toast } from "@/components/ui/use-toast"

export function SessionDetails({ session }: { session?: Session }) {
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studentMark, setStudentMark] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)

  const today = DateTime.now()

  const sessionUpdateMutation = useUpdateSession({
    onSuccess: () => {
      setIsLoading(false)
      toast({
        variant: "success",
        title: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastSuccessTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastSuccessDescription")}`,
      })
    },
    onError: () => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastErrorTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastErrorDescription")}`,
      })
    },
  })

  useEffect(() => {
    setStudentMark(session && session.studentMark ? session.studentMark : undefined)
  }, [session])

  function updateStudentMark(sessionId: number) {
    if (studentMark) {
      setIsLoading(true)
      sessionUpdateMutation.mutate({
        id: sessionId,
        studentMark,
      })
    }
  }

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
            <p>
              {t("provider.myPlanning.sessionDetails.studentMark")}:{" "}
              {session.student.studentMarks
                ? `${session.student.studentMarks.toFixed(2)}/5`
                : t("provider.myPlanning.sessionDetails.noInfo")}
            </p>
            {today > sessionStartDate && session.status !== "cancelled" && (
              <div className="mt-4">
                <p className="font-bold">{t("provider.myPlanning.sessionDetails.rateInput")}:</p>
                <div className="flex gap-5">
                  <Rating
                    iconsCount={5}
                    size={25}
                    SVGclassName="inline-block"
                    onClick={(mark) => setStudentMark(mark)}
                    initialValue={studentMark}
                  />
                  <Button disabled={isLoading} size="sm" onClick={() => updateStudentMark(session.id)}>
                    {t("provider.myPlanning.sessionDetails.evaluate")}
                  </Button>
                </div>
              </div>
            )}
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
