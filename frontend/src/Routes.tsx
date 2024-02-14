import { createBrowserRouter, RouterProvider } from "react-router-dom"

import ProviderLayout from "@/layouts/provider"
import ClientLayout from "@/layouts/client"
import AdminLayout from "@/layouts/admin"

import Landing from "@/pages/Landing"
import NotFound from "@/pages/NotFound"
import DashboardAdmin from "@/pages/admin/Dashboard"
import DashboardProvider from "@/pages/provider/Dashboard"
import Employees from "@/pages/provider/employees"
import HandleEmployee from "@/pages/provider/employees/handle-employee"
import Login from "@/pages/auth/Login.tsx"
import Register from "@/pages/auth/Register.tsx"
import Terms from "@/pages/Terms.tsx"
import CompanyClient from "@/pages/client/Company"
import AgencyClient from "@/pages/client/Company/Agency"
import ServiceClient from "@/pages/client/Company/Agency/Service"
import Agencies from "@/pages/provider/agencies"
import RegisterSuccess from "@/pages/auth/RegisterSuccess.tsx"
import NewProvider from "@/pages/provider/NewProvider.tsx"
import ProfileClient from "@/pages/client/User/ProfileClient.tsx"
import EmployeePlanning from "@/pages/provider/employee-planning"
import Search from "@/pages/client/Search"
import Users from "@/pages/admin/Users"
import Companies from "@/pages/admin/companies"
import Services from "@/pages/provider/services"
import App from "@/App.tsx"
import ForgotPassword from "@/pages/auth/ForgotPassword.tsx"
import MyCompany from "@/pages/provider/my-company"
import UserPlanning from "@/pages/client/User/UserPlanning"
import CompanyDetails from "@/pages/admin/companies/CompanyDetails"
import ResetPassword from "@/pages/auth/ResetPassword.tsx"
import ScheduleExceptions from "@/pages/provider/schedule-exceptions"
import ProtectedRoute from "@/components/security/ProtectedRoute.tsx"
import FeedBackBuilders from "@/pages/provider/feedback-builders"
import AuthLayout from "@/layouts/auth/AuthLayout.tsx"

const Routes = () => {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        {
          element: <ClientLayout />,
          path: "/",
          children: [
            {
              path: "",
              element: <Landing />,
            },
            {
              path: "/reset-password/:token",
              element: <ResetPassword />,
            },
            {
              path: "user/profile",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ProfileClient />,
                },
              ],
            },
            {
              path: "user/planning",
              element: <UserPlanning />,
            },
            {
              path: "terms",
              element: <Terms />,
            },
            {
              path: "search",
              element: <Search />,
            },
            {
              path: "companies/:companyId",
              element: <CompanyClient />,
            },
            {
              path: "companies/:companyId/agencies/:agencyId",
              element: <AgencyClient />,
            },
            {
              path: "companies/:companyId/agencies/:agencyId/services/:serviceId",
              element: <ServiceClient />,
            },
            {
              path: "provider/new",
              element: <NewProvider />,
            },
          ],
          errorElement: <NotFound />,
        },
        {
          path: "auth",
          element: <AuthLayout />,
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
            {
              path: "forgot-password",
              element: <ForgotPassword />,
            },
            {
              path: "register/welcome",
              element: <RegisterSuccess />,
            },
          ],
        },
        {
          element: <ProviderLayout />,
          path: "/provider",
          children: [
            {
              path: "",
              element: <DashboardProvider />,
            },
            {
              path: "company",
              element: <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_ADMIN"]} />,
              children: [
                {
                  path: "",
                  element: <MyCompany />,
                },
              ],
            },
            {
              path: "employee",
              element: <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_ADMIN"]} />,
              children: [
                {
                  path: "",
                  element: <Employees />,
                },
                {
                  path: ":userId",
                  element: <HandleEmployee />,
                },
              ],
            },
            {
              path: "agency",
              element: <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_ADMIN"]} />,
              children: [
                {
                  path: "",
                  element: <Agencies />,
                },
              ],
            },
            {
              path: "planning",
              element: <EmployeePlanning />,
            },
            {
              path: "service",
              element: <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_ADMIN"]} />,
              children: [
                {
                  path: "",
                  element: <Services />,
                },
              ],
            },
            {
              path: "schedule-exceptions",
              element: <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_ADMIN"]} />,
              children: [
                {
                  path: "",
                  element: <ScheduleExceptions />,
                },
              ],
            },
            {
              path: "feedback-builders",
              element: <FeedBackBuilders />,
            },
          ],
          errorElement: <NotFound />,
        },
        {
          element: <AdminLayout />,
          path: "/admin",
          children: [
            {
              path: "",
              element: <DashboardAdmin />,
            },
            {
              path: "companies",
              element: <Companies />,
            },
            {
              path: "companies/:companyId",
              element: <CompanyDetails />,
            },
            {
              path: "users",
              element: <Users />,
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default Routes
