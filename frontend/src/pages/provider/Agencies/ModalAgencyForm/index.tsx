import { Agency } from "@/utils/types.ts"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { PencilIcon } from "lucide-react"
import AgencyForm from "./agency-form.tsx"

export default function ModalFormAgency({
  agency,
  variant = "ghost",
}: {
  agency?: Agency
  variant?: "ghost" | "outline"
}) {
  const [isReadOnly, setIsReadOnly] = useState(!!agency)
  const { t } = useTranslation()
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!agency)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!agency ? t("ProviderAgencies.form.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!agency ? (
              t("ProviderAgencies.form.cta.new")
            ) : (
              <>
                Your agency{" "}
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                    {" "}
                    <PencilIcon />{" "}
                  </Button>
                )}{" "}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <AgencyForm agency={agency} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
