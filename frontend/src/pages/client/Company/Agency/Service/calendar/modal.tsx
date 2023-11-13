import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { computeServiceDuration } from "@/utils/helpers"
import { Service } from "@/utils/types"
import { DateTime } from "luxon"

interface ConfirmationModalProps {
  service: Service
  hourSelected: DateTime
  isModalOpen: boolean
  onModalOpenChange: (value: boolean) => void
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const { service, hourSelected, isModalOpen, onModalOpenChange } = props

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-start">
          <DialogTitle>Récapitulatif</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <p>Service: {service.name}</p>
          <p>Durée: {computeServiceDuration(service.duration)}</p>
          <p>Date: {hourSelected.toLocaleString(DateTime.DATETIME_SHORT)}</p>
        </div>
        <DialogFooter className="flex flex-row-reverse justify-start gap-2">
          <Button>Valider</Button>
          <Button variant="secondary" onClick={() => onModalOpenChange(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
