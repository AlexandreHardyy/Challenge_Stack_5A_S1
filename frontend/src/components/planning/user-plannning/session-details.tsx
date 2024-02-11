import { DateTime } from "luxon"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Session } from "@/utils/types"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import CancelSessionModal from "../cancel-session-modal"
import { Rating } from "react-simple-star-rating"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useCreateRatingSession } from "@/services/rating-service.service.ts"
import { toast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

export function SessionDetails({ session }: { session?: Session }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studentMark, setStudentMark] = useState<number>()
  const [studentComment, setStudentComment] = useState<string>()

  const today = DateTime.now()

  const ratingServiceMutation = useCreateRatingSession({
    onSuccess: () => {
      toast({
        variant: "success",
        title: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastSuccessTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastSuccessDescription")}`,
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastErrorTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.studentMarkToast.toastErrorDescription")}`,
      })
    },
  })

  useEffect(() => {
    if (session && session.ratingService) {
      console.log(session.ratingService)
      setStudentMark(session.ratingService.rating)
      setStudentComment(session.ratingService.comment)
    }
  }, [session])

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

  async function createRating() {
    if (studentMark && studentComment && session) {
      await ratingServiceMutation.mutateAsync({
        rating: studentMark,
        comment: studentComment,
        service: session.service["@id"],
        session: session["@id"],
      })
      await queryClient.invalidateQueries({ queryKey: ["userMe"] })
    }
  }

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
          {today > sessionStartDate && session.status !== "cancelled" && (
            <div className="mt-4">
              {!session.ratingService ? (
                <p className="font-bold">{t("provider.myPlanning.sessionDetails.rateProvider")}</p>
              ) : (
                <p className="font-bold">{t("provider.myPlanning.sessionDetails.alreadyRated")}</p>
              )}
              <div className="flex flex-col gap-5">
                <Rating
                  iconsCount={5}
                  size={25}
                  SVGclassName="inline-block"
                  onClick={(mark) => setStudentMark(mark)}
                  initialValue={studentMark}
                  readonly={!!session.ratingService}
                />
                <Textarea
                  disabled={!!session.ratingService}
                  value={studentComment}
                  onChange={(event) => setStudentComment(event.target.value)}
                />
                {!session.ratingService && (
                  <Button disabled={ratingServiceMutation.isLoading} size="sm" onClick={() => createRating()}>
                    {ratingServiceMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("provider.myPlanning.sessionDetails.evaluate")}
                  </Button>
                )}
              </div>
            </div>
          )}
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
