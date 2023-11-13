import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./Routes";
import { ThemeProvider } from "@/components/Theme-provider.tsx";
import { Toaster } from "@/components/ui/toaster";
import { ProvideAuth } from "@/context/AuthContext.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ProvideAuth>
          <Routes />
          <Toaster />
        </ProvideAuth>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
