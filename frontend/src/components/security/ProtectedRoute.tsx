import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.tsx"

const ProtectedRoute = ({ roles }: { roles?: string[] | undefined }) => {
  const { token, user } = useAuth()
  if (!token) {
    return <Navigate to="/login" />
  }
  console.log(user?.roles)

  if (roles && user?.roles && !roles.some((r) => user.roles?.includes(r))) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
