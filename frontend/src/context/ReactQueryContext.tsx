import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

export const ReactQueryContext = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  })
  return <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
}
