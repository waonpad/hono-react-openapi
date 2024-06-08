import { SuspenseFallback } from "@/components/elements/suspense-fallback";
import type { ReactNode } from "react";
import { SetAuthProvider, useAuthCtx } from "./use-auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthCtx();

  if (auth.isLoading) {
    return <SuspenseFallback />;
  }

  return <SetAuthProvider value={auth}>{children}</SetAuthProvider>;
};
