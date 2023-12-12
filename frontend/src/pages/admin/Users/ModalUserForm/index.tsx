import { User } from "@/utils/types.ts"
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
import UserForm from "@/pages/admin/Users/ModalUserForm/user-form.tsx"

export default function ModalUserForm({ user, variant = "ghost" }: { user?: User; variant?: "ghost" | "outline" }) {
  const [isReadOnly, setIsReadOnly] = useState(!!user)
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!user)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!user ? t("admin.users.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!user ? (
              t("admin.users.cta.new")
            ) : (
              <>
                <div className="flex items-center">
                  <h2>{t("admin.users.table.user")}</h2>
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
            <UserForm user={user} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
