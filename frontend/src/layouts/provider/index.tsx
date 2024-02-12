import SideHeader from "@/layouts/provider/SideHeader"
import ProtectedRoute from "@/components/security/ProtectedRoute.tsx"

const ProviderLayout = () => {
  return (
    <>
      <SideHeader />
      <main className="p-6 h-full m-h-[100vh] pl-64">
        <ProtectedRoute roles={["ROLE_PROVIDER", "ROLE_EMPLOYEE", "ROLE_ADMIN"]} />
      </main>
    </>
  )
}

export default ProviderLayout
