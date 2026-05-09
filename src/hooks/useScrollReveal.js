import { useEffect, useRef } from 'react';

/**
 * Scroll reveal hook — triggers 'visible' class on elements in viewport.
 * Usage: pass a selector string, e.g. useScrollReveal('.reveal')
 */
export function useScrollReveal(selector = '.reveal', options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = options;

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, threshold, rootMargin]);
}

/**
 * Animated number counter hook.
 */
export function useCounter(end, duration = 2000, start = 0) {
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const startTime = performance.now();
        const numeric = parseInt(end.replace(/\D/g, ''), 10);
        const suffix = end.replace(/[0-9]/g, '');

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(start + (numeric - start) * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, start]);

  return ref;
}
