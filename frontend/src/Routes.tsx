import { createBrowserRouter, RouterProvider } from "react-router-dom"

import AdminLayout from "@/layouts/admin"
import ClientLayout from "@/layouts/client"

import Landing from "@/pages/Landing"
import NotFound from "@/pages/NotFound"
import HomeAdmin from "@/pages/admin/HomeAdmin"
import HomeProvider from "@/pages/provider/HomeProvider"
import Employees from "@/pages/provider/Employees"
import Login from "@/pages/auth/Login.tsx"
import Register from "@/pages/auth/Register.tsx"
import Terms from "@/pages/Terms.tsx"
import CompanyClient from "@/pages/client/Company"
import AgencyClient from "./pages/client/Company/Agency"
import ServiceClient from "./pages/client/Company/Agency/Service"
import Agencies from "./pages/provider/Agencies"
import RegisterSuccess from "@/pages/auth/RegisterSuccess.tsx"
import NewProvider from "@/pages/provider/NewProvider.tsx"
import ProfileClient from "@/pages/client/User/ProfileClient.tsx"
import ForgotPassword from "@/pages/auth/ForgotPassword.tsx";

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
          path: "/forgot-password",
          element: <ForgotPassword />,
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
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <HomeAdmin />,
        },
        {
          path: "/provider",
          element: <HomeProvider />,
        },
        {
          path: "/provider/employee",
          element: <Employees />,
        },
        {
          path: "/provider/agency",
          element: <Agencies />,
        },
      ],
      errorElement: <NotFound />,
    },
  ])

  return <RouterProvider router={router} />
}

export default Routes
