import { Outlet } from "react-router-dom"
import SideAdminHeader from "@/layouts/admin/SideAdminHeader.tsx"

const AdminLayout = () => {
  return (
    <>
      <SideAdminHeader />
      <main className="p-6 h-full m-h-[100vh] pl-64">
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout
