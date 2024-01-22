import { Button } from "@/components/ui/button.tsx"
import { Link, useLocation } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"
import { CalendarDaysIcon, HomeIcon, LayoutDashboardIcon, LogOutIcon, UserCircle2Icon, Users2Icon } from "lucide-react"

const SideHeader = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const links = [
    {
      href: "/provider",
      content: (
        <>
          <LayoutDashboardIcon /> {t("header.sideHeader.menu.dashboard")}
        </>
      ),
    },
    {
      href: "/provider/employee",
      content: (
        <>
          <Users2Icon /> {t("header.sideHeader.menu.employees")}
        </>
      ),
    },
    {
      href: "/provider/agency",
      content: (
        <>
          <HomeIcon /> {t("header.sideHeader.menu.agencies")}
        </>
      ),
    },
    {
      href: "/provider/planning",
      content: (
        <>
          <CalendarDaysIcon /> {t("header.sideHeader.menu.planning")}
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

export default SideHeader
