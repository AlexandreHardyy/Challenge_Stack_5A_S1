import LoginForm from "@/components/form/LoginForm.tsx"
import { useTranslation } from "react-i18next"

const Login = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="text-4xl px-6">{t("common.form.login")}</h1>
      <div className="p-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
