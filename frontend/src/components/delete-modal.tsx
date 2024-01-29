import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { ReactNode } from "react"
import { Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"

type Props = {
  onDelete: () => void
  trigger?: ReactNode
  name: string
}

export const DeleteModal = ({ onDelete, trigger, name }: Props) => {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="px-2">
          {trigger ? trigger : <Trash2Icon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">{t("global.deleteModal.title")}</DialogTitle>
          <DialogDescription className="mb-6">
            {t("global.deleteModal.description")} ({name}) ?
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-4 pt-6">
            <DialogClose asChild>
              <Button type="button" variant="destructive" onClick={onDelete}>
                {t("global.deleteModal.confirm")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t("global.deleteModal.cancel")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
