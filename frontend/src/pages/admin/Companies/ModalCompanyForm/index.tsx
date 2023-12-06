import { Company } from "@/utils/types.ts"
import { useState } from "react"
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
import { t } from "i18next"
import CompanyForm from "./company-form.tsx"

export default function ModalCompanyForm({
  company,
  variant = "ghost",
}: {
  company?: Company
  variant?: "ghost" | "outline"
}) {
  const [isReadOnly, setIsReadOnly] = useState(!!company)
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!company)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!company ? t("admin.companies.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!company ? (
              t("admin.companies.cta.new")
            ) : (
              <>
                <div className="flex items-center">
                  <h2>{t("admin.companies.table.company")}</h2>
                  {isReadOnly && (
                    <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                      <PencilIcon />
                    </Button>
                  )}{" "}
                </div>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <CompanyForm company={company} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
