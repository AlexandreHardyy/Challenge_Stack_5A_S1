import RegisterForm from "@/components/form/RegisterForm.tsx"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Register = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Link to="/">
        <img src="/logo.png" alt="logo" className="w-14 rounded" />
      </Link>
      <h1 className="text-4xl px-6 text-center font-bold">{t("common.form.register")}</h1>
      <div className="p-10">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
