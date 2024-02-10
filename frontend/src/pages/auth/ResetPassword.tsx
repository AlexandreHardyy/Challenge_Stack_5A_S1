import { useTranslation } from "react-i18next"
import ResetPasswordForm from "@/components/form/ResetPasswordForm.tsx"

const ResetPassword = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-4xl px-6">{t("common.form.resetPassword")}</h1>
      <div className="p-10">
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default ResetPassword
