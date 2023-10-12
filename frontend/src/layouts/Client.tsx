import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "@/layouts/Footer.tsx";

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
