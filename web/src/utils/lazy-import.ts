import * as React from "react";

/**
 * @description
 * React.lazyを名前付きインポートに対しても使えるようにする \
 * https://github.com/facebook/react/issues/14603#issuecomment-726551598
 * @example
 * const { Home } = lazyImport(() => import("./Home"), "Home");
 */
export function lazyImport<T extends React.ComponentType<unknown>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K,
): I {
  return Object.create({
    [name]: React.lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}
