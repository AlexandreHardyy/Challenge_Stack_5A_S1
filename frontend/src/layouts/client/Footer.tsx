import LanguageSelector from "@/components/LanguageSelector.tsx"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="flex items-center justify-between px-8 py-4 bg-neutral-800 text-white h-28">
      <LanguageSelector />
      <div>
        <p>{t("footer.menu.knowUs")}</p>
      </div>
      <div className="flex justify-center items-center">
        <p>{t("footer.menu.credits")}</p>
      </div>
      <div>
        <h4>{t("footer.menu.contact")}</h4>
        <p>roadwise@gmail.com</p>
      </div>
    </footer>
  )
}

export default Footer
