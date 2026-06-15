'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Determine initial transform based on direction
  const getTransform = () => {
    if (isVisible) return 'translateY(0) translateX(0)';
    switch (direction) {
      case 'up': return 'translateY(28px)';
      case 'down': return 'translateY(-28px)';
      case 'left': return 'translateX(28px)';
      case 'right': return 'translateX(-28px)';
      default: return 'translateY(28px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
