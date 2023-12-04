import SideHeader from "@/layouts/provider/SideHeader"
import { Outlet } from "react-router-dom"

const ProviderLayout = () => {
  return (
    <>
      <SideHeader />
      <main className="p-6 h-full m-h-[100vh] pl-64">
        <Outlet />
      </main>
    </>
  )
}

export default ProviderLayout
