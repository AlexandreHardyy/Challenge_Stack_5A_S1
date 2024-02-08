import { useTranslation } from "react-i18next"
import ForgotPasswordForm from "@/components/form/ForgotPasswordForm.tsx"

const ForgotPassword = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-4xl px-6">{t("common.form.forgotPassword")}</h1>
      <div className="p-10">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword
