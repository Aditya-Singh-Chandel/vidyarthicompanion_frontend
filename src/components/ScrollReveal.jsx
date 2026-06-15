'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Wires scroll-triggered reveal animations app-wide.
 * Any element with `data-reveal` fades/slides in when it enters the viewport.
 * Re-scans on route change so newly mounted pages animate too.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll('[data-reveal]:not(.cf-visible)'));

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('cf-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cf-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // small delay so freshly-routed DOM is settled
    const t = setTimeout(() => els.forEach((el) => io.observe(el)), 60);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
