import { useState, useEffect } from 'react';

let sharedObserver;
if (typeof window !== 'undefined') {
  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { target, isIntersecting } = entry;
        target.inViewCallback(isIntersecting);
      });
    },
    { root: null, rootMargin: '0px', threshold: 0 },
  );
}

const useInViewHomepage = (ref) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      element.inViewCallback = (isInView) => {
        setInView(isInView);
      };
      sharedObserver.observe(element);

      return () => {
        sharedObserver.unobserve(element);
      };
    }
  }, [ref]);

  return inView;
};

export default useInViewHomepage;
