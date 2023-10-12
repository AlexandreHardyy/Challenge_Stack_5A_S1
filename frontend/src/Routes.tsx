import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom"
  // ...
import ClientLayout from "./layouts/Client"
import Landing from "./pages/Landing"
import NotFound from "./pages/NotFound"
import AdminLayout from "./layouts/Admin"
import HomeAdmin from "./pages/admin/HomeAdmin"
import HomeProvider from "./pages/provider/HomeProvider"
  
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
            path: "/provider",
            element: <HomeProvider />,
          }
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
          }
        ],
        errorElement: <NotFound />,
      }
    ])
  
    return (
        <RouterProvider router={router} />
    )
  }
  
  export default Routes