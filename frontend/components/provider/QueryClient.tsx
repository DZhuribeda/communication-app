import { createQueryClient } from "@lib/query-client";
import React from "react";
import { QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";

export default function QueryProvider({ children, dehydratedState }) {
  const [queryClient] = React.useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
