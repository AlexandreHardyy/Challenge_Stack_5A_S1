import SideAdminHeader from "@/layouts/admin/SideAdminHeader.tsx"
import ProtectedRoute from "@/components/security/ProtectedRoute.tsx"

const AdminLayout = () => {
  return (
    <>
      <SideAdminHeader />
      <main className="p-6 h-full m-h-[100vh] pl-64">
        <ProtectedRoute roles={["ROLE_ADMIN"]} />
      </main>
    </>
  )
}

export default AdminLayout
