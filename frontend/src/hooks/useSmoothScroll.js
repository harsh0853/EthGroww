import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      window.scrollTo({
        top: currentScroll,
        behavior: 'smooth'
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};