import { createBrowserRouter, RouterProvider } from "react-router-dom";
// ...
import ClientLayout from "./layouts/Client";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/Admin";
import HomeAdmin from "./pages/admin/HomeAdmin";
import HomeProvider from "./pages/provider/HomeProvider";
import Employees from "./pages/provider/Employees";
import Login from "@/pages/auth/Login.tsx";
import Register from "@/pages/auth/Register.tsx";
import Terms from "@/pages/Terms.tsx";

const Routes = () => {
  const router = createBrowserRouter([
    {
      element: <ClientLayout />,
      children: [
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/terms",
          element: <Terms />,
        },
      ],
      errorElement: <NotFound />,
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <HomeAdmin />,
        },
        {
          path: "/provider",
          element: <HomeProvider />,
        },
        {
          path: "/provider/employee",
          element: <Employees />,
        },
      ],
      errorElement: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
