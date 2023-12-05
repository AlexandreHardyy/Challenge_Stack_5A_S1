import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import Routes from "./Routes"
import { ThemeProvider } from "@/components/Theme-provider.tsx"
import "./i18n"
import AuthProvider from "@/context/AuthContext.tsx"
import { Toaster } from "./components/ui/toaster"
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8877/api/';
console.log("test ", import.meta.env.VITE_API_URL)

const queryClient = new QueryClient()

const rootDiv = document.getElementById("root")
rootDiv?.setAttribute("class", "flex flex-col min-h-screen relative")

ReactDOM.createRoot(rootDiv!).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>
)
