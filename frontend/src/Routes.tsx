import { createBrowserRouter, RouterProvider } from "react-router-dom"

import ProviderLayout from "@/layouts/provider"
import ClientLayout from "@/layouts/client"
import AdminLayout from "@/layouts/admin"

import Landing from "@/pages/Landing"
import NotFound from "@/pages/NotFound"
import HomeAdmin from "@/pages/admin/HomeAdmin"
import HomeProvider from "@/pages/provider/HomeProvider"
import Employees from "@/pages/provider/employees"
import HandleEmployee from "@/pages/provider/employees/handle-employee"
import Login from "@/pages/auth/Login.tsx"
import Register from "@/pages/auth/Register.tsx"
import Terms from "@/pages/Terms.tsx"
import CompanyClient from "@/pages/client/Company"
import AgencyClient from "@/pages/client/Company/Agency"
import ServiceClient from "@/pages/client/Company/Agency/Service"
import Agencies from "@/pages/provider/Agencies"
import RegisterSuccess from "@/pages/auth/RegisterSuccess.tsx"
import NewProvider from "@/pages/provider/NewProvider.tsx"
import ProfileClient from "@/pages/client/User/ProfileClient.tsx"
import EmployeePlanning from "./pages/provider/EmployeePlanning"
import Companies from "./pages/admin/Companies"
import Users from "./pages/admin/Users"
import Search from "./pages/client/Search"

const Routes = () => {
  const router = createBrowserRouter([
    {
      element: <ClientLayout />,
      children: [
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/register/welcome",
          element: <RegisterSuccess />,
        },
        {
          path: "/user/profile",
          element: <ProfileClient />,
        },
        {
          path: "/terms",
          element: <Terms />,
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: "/companies/:companyId",
          element: <CompanyClient />,
        },
        {
          path: "/companies/:companyId/agencies/:agencyId",
          element: <AgencyClient />,
        },
        {
          path: "/companies/:companyId/agencies/:agencyId/services/:serviceId",
          element: <ServiceClient />,
        },
        {
          path: "/provider/new",
          element: <NewProvider />,
        },
      ],
      errorElement: <NotFound />,
    },
    {
      element: <ProviderLayout />,
      children: [
        {
          path: "/provider",
          element: <HomeProvider />,
        },
        {
          path: "/provider/employee",
          element: <Employees />,
        },
        {
          path: "/provider/employee/:userId",
          element: <HandleEmployee />,
        },
        {
          path: "/provider/agency",
          element: <Agencies />,
        },
        {
          path: "/provider/planning",
          element: <EmployeePlanning />,
        },
      ],
      errorElement: <NotFound />,
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <HomeAdmin />,
        },
        {
          path: "/admin/companies",
          element: <Companies />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default Routes
