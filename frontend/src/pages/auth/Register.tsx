import RegisterForm from "@/components/form/RegisterForm.tsx"
import { useTranslation } from "react-i18next"

const Register = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="text-4xl px-6">{t("common.form.register")}</h1>
      <div className="p-10">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
