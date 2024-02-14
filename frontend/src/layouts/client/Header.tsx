import { Button } from "@/components/ui/button.tsx"
import { Link, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/context/AuthContext.tsx"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover"
import UserAvatar from "@/components/user-avatar"

const Header = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex px-8 py-4 items-center justify-between sticky top-0 bg-background drop-shadow-md z-50 h-18">
      <h1>
        <Link to="/">
          <img src="/logo.png" alt="logo" className="w-14 rounded" />
        </Link>
      </h1>
      <div className="flex gap-8">
        <Button variant="ghost" asChild>
          <Link to="/search">{t("landing.ctaStudent")}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/provider/new">{t("landing.ctaProvider")}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/#">{t("header.menu.about")}</Link>
        </Button>
      </div>
      {!auth.token ? (
        <div className="flex gap-4">
          <ModeToggle />
          <Button variant="secondary" asChild>
            <Link to="auth/register">{t("header.cta.signUp")}</Link>
          </Button>
          <Button asChild>
            <Link to="auth/login">{t("header.cta.signIn")}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <ModeToggle />
          <Popover>
            <PopoverTrigger>
              <UserAvatar
                email={auth.user?.email ?? ""}
                image={auth.user?.image?.contentUrl ?? null}
                className="w-10 h-10 rounded object-cover"
              />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3">
              <Button variant={"outline"} onClick={() => navigate("/user/profile")}>
                {t("header.cta.profile")}
              </Button>
              <Button variant={"outline"} onClick={() => navigate("/user/planning")}>
                {t("header.cta.planning")}
              </Button>
              {auth.user?.roles?.includes("ROLE_ADMIN") && (
                <Button variant={"outline"} onClick={() => navigate("/admin")}>
                  {t("header.cta.admin")}
                </Button>
              )}
              {(auth.user?.roles?.includes("ROLE_PROVIDER") || auth.user?.roles?.includes("ROLE_EMPLOYEE")) && (
                <Button variant={"outline"} onClick={() => navigate("/provider")}>
                  {t("header.cta.provider")}
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  auth.setToken(null)
                  navigate("/", { replace: true })
                }}
              >
                {t("header.cta.logOut")}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  )
}

export default Header
