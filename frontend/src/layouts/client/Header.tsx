import { Button } from "@/components/ui/button.tsx"
import { Link, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/context/AuthContext.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover"

const Header = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()

  const UserAvatar = ({ email, image }: { email: string; image: string | null }) => {
    const placeholderImage = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${email}`

    const finalImage = image ? `${import.meta.env.VITE_API_URL_PUBLIC}${image}` : placeholderImage

    return (
      <Avatar>
        <AvatarImage src={finalImage} className="w-10 rounded object-cover" />
        <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <header className="flex px-8 py-4 items-center justify-between sticky top-0 bg-background drop-shadow-md z-50 h-18">
      <h1>
        <Link to="/">RoadWise</Link>
      </h1>
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
      {!auth.token ? (
        <div className="flex gap-4">
          <ModeToggle />
          <Button variant="secondary" asChild>
            <Link to="/register">{t("header.cta.signUp")}</Link>
          </Button>
          <Button asChild>
            <Link to="/login">{t("header.cta.signIn")}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <ModeToggle />
          <Popover>
            <PopoverTrigger>
              <UserAvatar email={auth.user?.email ?? ""} image={auth.user?.image?.contentUrl ?? null} />
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
              {auth.user?.roles?.includes("ROLE_PROVIDER") && (
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
