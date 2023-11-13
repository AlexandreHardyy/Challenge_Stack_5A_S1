import Header from "../components/Header.tsx";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <main className="p-6 pb-20">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
