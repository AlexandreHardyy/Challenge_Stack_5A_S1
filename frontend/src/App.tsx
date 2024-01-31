import AuthProvider from "@/context/AuthContext.tsx"
import { Toaster } from "@/components/ui/toaster.tsx"
import { Outlet } from "react-router-dom"

const App = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  )
}

export default App
