import { QueryClient } from "react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  })
}