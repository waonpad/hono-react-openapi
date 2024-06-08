import { useErrorBoundary } from "react-error-boundary";

import { useWindowEvent } from "@/utils/hooks/use-window-event";
import type { ReactNode } from "react";

/**
 * @description
 * react-error-boundaryだけでは通常補足できないエラーを補足可能にする
 */
export const WatchUnhandledError = (): ReactNode => {
  const { showBoundary } = useErrorBoundary();

  useWindowEvent("error", (event) => showBoundary(event.error), []);

  useWindowEvent("unhandledrejection", (event) => showBoundary(event.reason), []);

  return null;
};
