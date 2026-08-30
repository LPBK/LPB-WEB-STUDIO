import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-scale, .reveal-slide-left, .reveal-slide-right'
    );

    elements.forEach((el) => {
      // If already in initial viewport, reveal immediately with slight delay
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => {
          el.classList.add('revealed');
        }, 100);
      } else {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};
