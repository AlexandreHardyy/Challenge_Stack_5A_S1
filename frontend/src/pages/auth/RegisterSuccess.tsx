import styles from "@/styles/RegisterSuccess.module.css"
import { useTranslation } from "react-i18next"

const RegisterSuccess = () => {
  const { t } = useTranslation()

  return (
    <div className="container p-5 text-center flex flex-col justify-center items-center gap-8">
      <svg
        id={styles.checkmark}
        className="w-24 h-24 block rounded-full stroke-2 stroke-background"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          id={styles.checkmark__circle}
          className="stroke-2 stroke-primary fill-none"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          style={{ strokeDasharray: 166, strokeDashoffset: 166, strokeMiterlimit: 10 }}
        />
        <path
          id={styles.checkmark__check}
          className="origin-[50%_50%]"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
          style={{ strokeDasharray: 48, strokeDashoffset: 48 }}
        />
      </svg>
      <div className="text-lg">
        <h1 className="text-2xl text-semibold">{t("common.validation.registerSuccess")}</h1>
        <p>{t("common.validation.checkEmail")}</p>
      </div>
    </div>
  )
}

export default RegisterSuccess
