import React, { useRef, useCallback } from 'react';

/**
 * Bidirectional Luxury Scroll Reveal Hook
 * Animates elements when scrolling UP and DOWN into view.
 */
export function useScrollReveal(options = {}) {
  const isOnce = options.once === true;
  const threshold = options.threshold !== undefined ? options.threshold : 0.05;
  const rootMargin = options.rootMargin || '0px';

  const observerRef = useRef(null);

  const setRef = useCallback((el) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!el) return;

    el.classList.add('scroll-reveal-base');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            if (el) {
              el.classList.add('scroll-reveal-visible');
              el.classList.remove('scroll-reveal-hidden');
            }
          });
          if (isOnce) {
            observer.unobserve(el);
          }
        } else if (!isOnce) {
          requestAnimationFrame(() => {
            if (el) {
              el.classList.remove('scroll-reveal-visible');
              el.classList.add('scroll-reveal-hidden');
            }
          });
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    observerRef.current = observer;
  }, [threshold, rootMargin, isOnce]);

  return setRef;
}

export function ScrollReveal({ children, className = '', style = {}, once = false, delay = 0 }) {
  const ref = useScrollReveal({ once });
  return React.createElement('div', {
    ref,
    className,
    style: { ...style, transitionDelay: delay ? `${delay}ms` : undefined }
  }, children);
}
