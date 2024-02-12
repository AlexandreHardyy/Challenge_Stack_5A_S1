import { Button } from "@/components/ui/button.tsx"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/Mode-toggle.tsx"
import { useTranslation } from "react-i18next"
import {
  BoxIcon,
  Building2Icon,
  CalendarCheck2Icon,
  CalendarDaysIcon,
  FactoryIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserCircle2Icon,
  Users2Icon,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const SideHeader = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const auth = useAuth()
  const navigate = useNavigate()

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
      href: "/provider/company",
      role: "ROLE_PROVIDER",
      content: (
        <>
          <Building2Icon /> {t("header.sideHeader.menu.myCompany")}
        </>
      ),
    },
    {
      href: "/provider/employee",
      role: "ROLE_PROVIDER",
      content: (
        <>
          <Users2Icon /> {t("header.sideHeader.menu.employees")}
        </>
      ),
    },
    {
      href: "/provider/agency",
      role: "ROLE_PROVIDER",
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
    {
      href: "/provider/schedule-exceptions",
      role: "ROLE_PROVIDER",
      content: (
        <>
          <CalendarCheck2Icon /> {t("header.sideHeader.menu.scheduleExceptions")}
        </>
      ),
    },
    {
      href: "/provider/service",
      role: "ROLE_PROVIDER",
      content: (
        <>
          <BoxIcon /> {t("header.sideHeader.menu.services")}
        </>
      ),
    },
    {
      href: "/provider/feedback-builders",
      content: (
        <>
          <FactoryIcon /> {t("header.sideHeader.menu.feedBackBuilders")}
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
        {links
          .filter((link) => {
            if (!link.role) {
              return true
            }
            return auth.user?.roles.includes(link.role)
          })
          .map((link, index) => {
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
            <Link to="/user/profile">
              {" "}
              <UserCircle2Icon /> {t("header.cta.profile")}
            </Link>
          </Button>
          <ModeToggle className="self-center" />
        </div>

        <Button
          onClick={() => {
            auth.setToken(null)
            navigate("/", { replace: true })
          }}
          variant="destructive"
          className="flex gap-2 px-4"
        >
          <>
            <LogOutIcon /> {t("header.cta.logOut")}
          </>
        </Button>
      </div>
    </header>
  )
}

export default SideHeader
