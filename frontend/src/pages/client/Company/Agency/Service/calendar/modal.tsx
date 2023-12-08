import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useAddSession } from "@/services/sessions.service"
import { getUserMe } from "@/services/user/user.service"
import { computeServiceDuration } from "@/utils/helpers"
import { Agency, Service } from "@/utils/types"
import { Loader2 } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface ConfirmationModalProps {
  service: Service
  hourSelected: DateTime
  isModalOpen: boolean
  // TODO: should not be undefined here
  instructorId?: number
  agency: Agency
  onModalOpenChange: (value: boolean) => void
  sessionsReftech: () => void
}

export default function ConfirmationModal({
  service,
  hourSelected,
  isModalOpen,
  instructorId,
  agency,
  onModalOpenChange,
  sessionsReftech,
}: ConfirmationModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const sessionMutation = useAddSession({
    onSuccess: () => {
      setIsLoading(false)
      toast({
        variant: "success",
        title: "Session reserved !",
        description: "Your session has been reserved. You will receive soon a confirmation email",
      })
      onModalOpenChange(false)
      sessionsReftech()
    },
    onError: () => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "An error occured!",
        description: "An error occured during your session reservation.",
      })
      onModalOpenChange(false)
    },
  })

  // TODO: should not retrieve agencies with 0 intrsuctors

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-start">
          <DialogTitle>{t("serviceClient.calendarModal.summary")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <p>
            {t("serviceClient.calendarModal.serviceName")}: {service.name}
          </p>
          <p>
            {t("serviceClient.calendarModal.duration")}: {computeServiceDuration(service.duration)}
          </p>
          <p>
            {t("serviceClient.calendarModal.date")}: {hourSelected.toLocaleString(DateTime.DATETIME_SHORT)}
          </p>
        </div>
        <DialogFooter className="flex flex-row-reverse justify-start gap-2">
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              const user = (await getUserMe()).data
              sessionMutation.mutate({
                student: `/api/users/${user.id}`,
                instructor: `/api/users/${instructorId}`,
                service: `/api/services/${service.id}`,
                agency: `/api/agencies/${agency.id}`,
                startDate: hourSelected,
                endDate: hourSelected.plus({ minute: service.duration }),
                status: "created",
              })
            }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.cta.submit")}
          </Button>
          <Button variant="secondary" onClick={() => onModalOpenChange(false)}>
            {t("common.cta.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
