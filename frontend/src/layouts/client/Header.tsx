import { Button } from "@/components/ui/button.tsx"
import { Link } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"

const Header = () => {
  const { t } = useTranslation()
  return (
    <header className="flex px-8 py-4 items-center justify-between sticky top-0 bg-background drop-shadow-md z-50">
      <h1><Link to="/">RoadWise</Link></h1>
      <div className="flex gap-8">
        <Button variant="ghost" asChild>
          <Link to="/#">{t("header.menu.services")}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/#">{t("header.menu.FAQ")}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/#">{t("header.menu.about")}</Link>
        </Button>
      </div>
      <div className="flex gap-4">
        <ModeToggle />
        <Button variant="secondary" asChild>
          <Link to="/register">{t("header.cta.signUp")}</Link>
        </Button>
        <Button asChild>
          <Link to="/login">{t("header.cta.signIn")}</Link>
        </Button>
      </div>
    </header>
  )
}

export default Header
