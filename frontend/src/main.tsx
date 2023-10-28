import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./Routes";
import { ThemeProvider } from "@/components/Theme-provider.tsx";
import './i18n'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Routes />
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>,
);
