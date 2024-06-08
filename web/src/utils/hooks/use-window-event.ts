import { type DependencyList, useCallback, useEffect } from "react";

/**
 * @description
 * 短いコードでwindowイベントのリスナーを登録するカスタムフック
 */
export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  deps: DependencyList,
  options?: boolean | AddEventListenerOptions,
) => {
  const memoizedListener = useCallback(listener, deps);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (window) {
      window.addEventListener(type, memoizedListener, options);
      return () => {
        window.removeEventListener(type, memoizedListener, options);
      };
    }
  }, [deps]);
};
