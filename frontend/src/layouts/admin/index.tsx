import SideHeader from "@/layouts/admin/SideHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <SideHeader />
      <main className="p-6 mt-6 h-full m-h-[100vh] pl-64">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
