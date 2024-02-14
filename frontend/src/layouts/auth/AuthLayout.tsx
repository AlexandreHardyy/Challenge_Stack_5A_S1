import { Outlet } from "react-router-dom"
import imgUrl from "../../assets/img/car-illustration.jpeg"

const AuthLayout = () => {
  return (
    <div className={"min-h-screen max-h-screen grid grid-cols-8 overflow-hidden"}>
      <div className={"col-span-3 p-6"}>
        <Outlet />
      </div>
      <div className={"h-full col-span-5 bg-green-200"}>
        <img src={imgUrl} alt={"illustration"} className={"object-cover h-full w-full"} />
      </div>
    </div>
  )
}

export default AuthLayout
