import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./Routes";
import { ThemeProvider } from "@/components/Theme-provider.tsx";

const queryClient = new QueryClient();

const rootDiv = document.getElementById("root")
rootDiv?.setAttribute('class', 'flex flex-col min-h-screen')

ReactDOM.createRoot(rootDiv!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
