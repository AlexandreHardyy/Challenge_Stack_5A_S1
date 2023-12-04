import { Button } from "@/components/ui/button.tsx"
import { Link, useLocation } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"
import { HomeIcon, LayoutDashboardIcon, LogOutIcon, UserCircle2Icon, Users2Icon } from "lucide-react"

const SideAdminHeader = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const links = [
    {
      href: "/admin",
      content: (
        <>
          <LayoutDashboardIcon /> {t("header.sideAdminHeader.menu.dashboard")}
        </>
      ),
    },
    {
      href: "/admin/companies",
      content: (
        <>
          <HomeIcon /> {t("header.sideAdminHeader.menu.companies")}
        </>
      ),
    },
    {
      href: "/admin/users",
      content: (
        <>
          <Users2Icon /> {t("header.sideAdminHeader.menu.users")}
        </>
      ),
    },
  ]

  return (
    <header className="flex flex-col p-4 w-56 h-full fixed left-0 top-0 bg-background drop-shadow-md z-50 gap-8">
      <h1 className="self-center text-2xl">
        <Link to="/">RoadWise</Link>
      </h1>
      <div className="flex flex-col gap-4 flex-1">
        {links.map((link, index) => {
          return (
            <Button
              key={index}
              variant={pathname === link.href ? "default" : "ghost"}
              asChild
              className="flex justify-start gap-2 px-4"
            >
              <Link to={link.href}> {link.content} </Link>
            </Button>
          )
        })}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button asChild variant="secondary" className="flex gap-2 px-4 flex-1">
            <Link to="/profile">
              {" "}
              <UserCircle2Icon /> {t("header.cta.profile")}
            </Link>
          </Button>
          <ModeToggle className="self-center" />
        </div>

        <Button asChild variant="destructive" className="flex gap-2 px-4">
          <Link to="/logout">
            {" "}
            <LogOutIcon /> {t("header.cta.logOut")}
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default SideAdminHeader
