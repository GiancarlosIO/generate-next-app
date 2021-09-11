export default `
import * as React from 'react';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

import '../../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
export default MyApp;

`