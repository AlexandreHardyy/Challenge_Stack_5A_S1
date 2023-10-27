import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./Routes";
import { ThemeProvider } from "@/components/Theme-provider.tsx";
import { Toaster } from "@/components/ui"
import './i18n'

const queryClient = new QueryClient()

const rootDiv = document.getElementById("root")
rootDiv?.setAttribute("class", "flex flex-col min-h-screen")

ReactDOM.createRoot(rootDiv!).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>
)
