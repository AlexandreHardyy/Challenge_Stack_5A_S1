import Header from "../components/Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer.tsx";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-6 pb-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;
