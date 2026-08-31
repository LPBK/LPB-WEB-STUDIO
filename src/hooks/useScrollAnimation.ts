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
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeElements = (container: Document | HTMLElement = document) => {
      const elements = container.querySelectorAll(
        '.reveal-on-scroll:not(.revealed), .reveal-scale:not(.revealed), .reveal-slide-left:not(.revealed), .reveal-slide-right:not(.revealed)'
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Watch for dynamically added DOM elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

