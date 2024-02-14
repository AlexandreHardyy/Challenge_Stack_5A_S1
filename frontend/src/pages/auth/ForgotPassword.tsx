import { useTranslation } from "react-i18next"
import ForgotPasswordForm from "@/components/form/ForgotPasswordForm.tsx"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Link to="/">
        <img src="/logo.png" alt="logo" className="w-14 rounded" />
      </Link>
      <h1 className="text-4xl px-6 text-center font-bold">{t("common.form.forgotPassword")}</h1>
      <div className="p-10">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword
