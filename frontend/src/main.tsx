import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import Routes from "./Routes"
import { ThemeProvider } from "@/components/Theme-provider.tsx"
import "./i18n"
import { ReactQueryContext } from "./context/ReactQueryContext"

const queryClient = new QueryClient()

const rootDiv = document.getElementById("root")
rootDiv?.setAttribute("class", "flex flex-col min-h-screen relative")

ReactDOM.createRoot(rootDiv!).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <ReactQueryContext>
            <Routes />
          </ReactQueryContext>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>
)
