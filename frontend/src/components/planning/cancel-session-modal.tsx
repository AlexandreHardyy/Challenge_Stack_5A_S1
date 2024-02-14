import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useUpdateSession } from "@/services/sessions.service"
import { Session } from "@/utils/types"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

type CancelSessionModalProps = {
  session: Session
  isModalOpen: boolean
  onModalOpenChange: (value: boolean) => void
}

function CancelSessionModal({ session, isModalOpen, onModalOpenChange }: CancelSessionModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)

  const sessionUpdateMutation = useUpdateSession({
    onSuccess: () => {
      setIsLoading(false)
      toast({
        variant: "success",
        title: `${t("provider.myPlanning.sessionDetails.modal.toastSuccessTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.modal.toastSuccessDescription")}`,
      })
      ;("getSessionsByStudent")
      queryClient.invalidateQueries(["getSessionsByStudent"])
      queryClient.invalidateQueries(["getSessionById"])
      onModalOpenChange(false)
    },
    onError: () => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: `${t("provider.myPlanning.sessionDetails.modal.toastErrorTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.modal.toastErrorDescription")}`,
      })
      onModalOpenChange(false)
    },
  })

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
      <DialogContent>
        <p>{t("provider.myPlanning.sessionDetails.modal.confirmationText")}</p>
        <div className="w-full justify-around flex">
          <Button variant="secondary" onClick={() => onModalOpenChange(false)}>
            {t("common.cta.cancel")}
          </Button>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              sessionUpdateMutation.mutate({
                id: session.id,
                status: "cancelled",
              })
            }}
          >
            {t("common.cta.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CancelSessionModal
