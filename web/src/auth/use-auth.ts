import { COOKIE_NAMES } from "@/constants/cookie-names";
import type { signIn as signInFn } from "@/features/auth/api/sign-in";
import type { signUp as signUpFn } from "@/features/auth/api/sign-up";
import { usersKeys } from "@/features/users/api/_keys";
import { useMeQuery } from "@/features/users/api/get-me";
import { queryClient } from "@/lib/tanstack-query";
import { getCookie } from "@/utils/cookie/get-cookie";
import { removeCookie } from "@/utils/cookie/remove-cookie";
import { setCookie } from "@/utils/cookie/set-cookie";
import { createCtx } from "@/utils/create-ctx";
import { useMemo, useState } from "react";

const [createdUseAuth, SetAuthProvider] = createCtx<ReturnType<typeof useAuthCtx>>();

export { SetAuthProvider };

export const useAuth = createdUseAuth;

export const useAuthCtx = () => {
  const [authToken, setAuthToken] = useState<string | null>(getCookie(COOKIE_NAMES.AUTH_TOKEN));

  const { data, isLoading, refetch } = useMeQuery({ init: {}, config: { enabled: !!authToken } });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(
    async () => (authToken ? await refetch() : queryClient.removeQueries({ queryKey: usersKeys.me() })),
    [authToken],
  );

  const [user, error] = data ?? [null, null];

  if (error) throw error;

  const signUp = (data: NonNullable<Awaited<ReturnType<typeof signUpFn.fetcher>>[0]>) => {
    setCookie(COOKIE_NAMES.AUTH_TOKEN, data.token);
    setAuthToken(data.token);
  };

  const signIn = (data: NonNullable<Awaited<ReturnType<typeof signInFn.fetcher>>[0]>) => {
    setCookie(COOKIE_NAMES.AUTH_TOKEN, data.token);
    setAuthToken(data.token);
  };

  const signOut = () => {
    removeCookie(COOKIE_NAMES.AUTH_TOKEN);
    setAuthToken(null);
  };

  return { user, isLoading, signUp, signIn, signOut };
};
