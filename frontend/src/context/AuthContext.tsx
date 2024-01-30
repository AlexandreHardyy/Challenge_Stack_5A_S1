import { createContext, useContext, useEffect, useMemo, useState } from "react"
import api from "@/utils/api.ts"
import { getUserMe } from "@/services/user/user.service.ts"
import { User } from "@/utils/types.ts"
import { Spinner } from "@/components/loader/Spinner.tsx"

interface AuthContext {
  token: string | null
  setToken: (newToken: string | null) => void
  user: User | null
}

const AuthContext = createContext({} as AuthContext)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState<User | null>(null)

  const setToken = (newToken: string | null) => {
    setToken_(newToken)
  }

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token
      localStorage.setItem("token", token)
      getUserMe().then((res) => {
        setUser(res.data)
      })
    } else {
      delete api.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
      setUser(null)
    }
  }, [token])

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
    }),
    [token, user]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {(user && token) || !token ? (
        children
      ) : (
        <div className="flex justify-center items-center w-full h-screen gap-3">
          <Spinner />
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
