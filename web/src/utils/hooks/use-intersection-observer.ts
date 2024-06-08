// https://zenn.dev/yumemi_inc/articles/2021-04-13-react-query-intersection-observer

import React from "react";

/**
 * IntersectionObserver を使って、要素が画面内に入った時にコールバックを実行する
 */
export const useIntersectionObserver = ({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = "0px",
  enabled = true,
}: {
  root?: React.RefObject<Element>;
  target: React.RefObject<Element>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}) => {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onIntersect();
          }
        }
      },
      {
        root: root?.current,
        rootMargin,
        threshold,
      },
    );

    const el = target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [enabled, root, rootMargin, threshold, target, onIntersect]);
};
