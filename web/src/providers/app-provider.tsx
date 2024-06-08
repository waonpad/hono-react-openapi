import { type ReactNode, Suspense } from "react";

import { AuthProvider } from "@/auth/auth-provider";
import { ErrorFallback } from "@/components/elements/error-fallback";
import { SuspenseFallback } from "@/components/elements/suspense-fallback";
import { WatchUnhandledError } from "@/lib/react-error-boundary";
import { QueryClientProvider, queryClient } from "@/lib/tanstack-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WatchUnhandledError />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Suspense fallback={<SuspenseFallback />}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
