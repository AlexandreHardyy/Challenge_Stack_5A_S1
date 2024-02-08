import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Routes from "./Routes"
import { ThemeProvider } from "@/components/Theme-provider.tsx"
import "./i18n"
import { ReactQueryContext } from "./context/ReactQueryContext"

const rootDiv = document.getElementById("root")
rootDiv?.setAttribute("class", "flex flex-col min-h-screen relative")

ReactDOM.createRoot(rootDiv!).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ReactQueryContext>
          <Routes />
        </ReactQueryContext>
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>
)
