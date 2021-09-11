import * as React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';

const MyApp: React.FC = ({ children }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default MyApp;
