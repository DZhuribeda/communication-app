// _app.jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { Provider } from 'jotai';
import { queryClientAtom } from 'jotai/query'

export default function QueryProvider({ children, dehydratedState }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Provider initialValues={[[queryClientAtom, queryClient]]}>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </Provider>
    </QueryClientProvider>
  );
}
