import Header from "./Header.js"
import { Outlet } from "react-router-dom"
import Footer from "@/layouts/client/Footer.tsx"

const ClientLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-6 pb-20">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default ClientLayout
