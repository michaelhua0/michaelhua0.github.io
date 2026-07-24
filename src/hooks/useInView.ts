import { useEffect, useRef, useState } from "react";

/* Fires once when the element scrolls into view. Content is visible by
   default (opacity handled in CSS), so a failed observer never hides it. */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -12% 0px",
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
