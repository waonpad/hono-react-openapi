import { COOKIE_NAMES } from "@/constants/cookie-names";
import type { signIn as signInFn } from "@/features/auth/api/sign-in";
import type { signUp as signUpFn } from "@/features/auth/api/sign-up";
import { useMeQuery } from "@/features/users/api/get-me";
import { getCookie } from "@/utils/cookie/get-cookie";
import { removeCookie } from "@/utils/cookie/remove-cookie";
import { setCookie } from "@/utils/cookie/set-cookie";
import { createCtx } from "@/utils/create-ctx";

const [createdUseAuth, SetAuthProvider] = createCtx<ReturnType<typeof useAuthCtx>>();

export { SetAuthProvider };

export const useAuth = createdUseAuth;

export const useAuthCtx = () => {
  const authToken = getCookie(COOKIE_NAMES.AUTH_TOKEN);

  console.log(authToken);

  const { data, isLoading } = useMeQuery({ init: {}, config: { enabled: !!authToken } });

  const [user, error] = data ?? [null, null];

  if (error) throw error;

  const signUp = (data: NonNullable<Awaited<ReturnType<typeof signUpFn.fetcher>>[0]>) => {
    setCookie(COOKIE_NAMES.AUTH_TOKEN, data.token);
  };

  const signIn = (data: NonNullable<Awaited<ReturnType<typeof signInFn.fetcher>>[0]>) => {
    setCookie(COOKIE_NAMES.AUTH_TOKEN, data.token);
  };

  const signOut = () => {
    removeCookie(COOKIE_NAMES.AUTH_TOKEN);
  };

  return { user, isLoading, signUp, signIn, signOut };
};
