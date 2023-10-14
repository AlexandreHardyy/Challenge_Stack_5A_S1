import Header from "../components/Header.tsx";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <main className="p-6 mt-20 h-full m-h-[100vh]">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
