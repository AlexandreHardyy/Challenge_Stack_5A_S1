import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useUpdateSessionStatus } from "@/services/sessions.service"
import { Session } from "@/utils/types"
import { useState } from "react"
import { useTranslation } from "react-i18next"

type CancelSessionModalProps = {
  session: Session
  isModalOpen: boolean
  onModalOpenChange: (value: boolean) => void
}

function CancelSessionModal({ session, isModalOpen, onModalOpenChange }: CancelSessionModalProps) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  const sessionUpdateMutation = useUpdateSessionStatus({
    onSuccess: () => {
      setIsLoading(false)
      toast({
        variant: "success",
        title: `${t("provider.myPlanning.sessionDetails.modal.toastSuccessTitle")}`,
        description: `${t("provider.myPlanning.sessionDetails.modal.toastSuccessDescription")}`,
      })
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
