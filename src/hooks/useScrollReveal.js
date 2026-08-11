import { useEffect, useRef } from 'react';

/**
 * Bidirectional Luxury Scroll Reveal Hook
 * Animates elements when scrolling UP and DOWN into view.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isOnce = options.once === true; // Default to repeatable (once: false) for dynamic scroll up & down
    const threshold = options.threshold !== undefined ? options.threshold : 0.12;
    const rootMargin = options.rootMargin || '0px 0px -30px 0px';

    el.classList.add('scroll-reveal-base');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-reveal-visible');
          el.classList.remove('scroll-reveal-hidden');
          if (isOnce) {
            observer.unobserve(el);
          }
        } else if (!isOnce) {
          el.classList.remove('scroll-reveal-visible');
          el.classList.add('scroll-reveal-hidden');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return ref;
}
