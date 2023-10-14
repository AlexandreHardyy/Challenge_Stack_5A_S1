import Header from "../components/Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer.tsx";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-20 h-full m-h-[100vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;
