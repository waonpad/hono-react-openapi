import { createContext, useContext } from "react";

/**
 * @description
 * 短いコードでContextとProviderを作成するカスタムフック
 * @example
 * const [createdUseXXX, SetXXXProvider] = createCtx<RerurnType<typeof useXXXCtx>>();
 * export { SetXXXProvider };
 * export const useXXX = createdUseXXX;
 * export const useXXXCtx = () => {
 *   ...
 * };
 */
export const createCtx = <ContextType>() => {
  const ctx = createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
};
