import { useState, useEffect } from 'react';

const useInView = (selector, options, defaultValue) => {
  const [inView, setInView] = useState(!!defaultValue);

  useEffect(() => {
    let element = document.querySelector(selector);

    if (element && 'IntersectionObserver' in window) {
      const handler = (entries) => {
        setInView(entries[0].isIntersecting);
      };

      const observer = new IntersectionObserver(handler, options);
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [selector, options]);

  return inView;
};

export default useInView;
