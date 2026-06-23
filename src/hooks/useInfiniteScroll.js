import { useRef, useCallback } from "react";

export function useInfiniteScroll(onIntersect, isLoading, hasMore) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onIntersect();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, onIntersect]
  );

  return lastElementRef;
}
