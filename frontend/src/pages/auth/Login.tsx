import LoginForm from "@/components/form/LoginForm.tsx"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Login = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Link to="/">
        <img src="/logo.png" alt="logo" className="w-14 rounded" />
      </Link>
      <h1 className="text-4xl px-6 text-center font-bold">{t("common.form.login")}</h1>
      <div className="p-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
