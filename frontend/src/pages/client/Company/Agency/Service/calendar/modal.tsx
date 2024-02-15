import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/AuthContext"
import { useAddSession } from "@/services/sessions.service"
import { computeServiceDuration } from "@/utils/helpers"
import { Agency, Service } from "@/utils/types"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

interface ConfirmationModalProps {
  service: Service
  hourSelected: DateTime
  isModalOpen: boolean
  instructorId?: number
  agency: Agency
  onModalOpenChange: (value: boolean) => void
}

export default function ConfirmationModal({
  service,
  hourSelected,
  isModalOpen,
  instructorId,
  agency,
  onModalOpenChange,
}: ConfirmationModalProps) {
  const user = useAuth().user
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const sessionMutation = useAddSession({
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Session reserved !",
        description: "Your session has been reserved. You will receive soon a confirmation email",
      })
      queryClient.invalidateQueries(["getDisponibilities"])
      onModalOpenChange(false)
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "An error occurred!",
        description: "An error occurred during your session reservation.",
      })
      onModalOpenChange(false)
    },
  })

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
            disabled={sessionMutation.isLoading}
            onClick={async () => {
              sessionMutation.mutate({
                student: `/api/users/${user?.id}`,
                instructor: `/api/users/${instructorId}`,
                service: `/api/services/${service.id}`,
                agency: `/api/agencies/${agency.id}`,
                startDate: hourSelected,
                endDate: hourSelected.plus({ minute: service.duration }),
                status: "created",
              })
            }}
          >
            {sessionMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
