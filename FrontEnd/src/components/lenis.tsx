import Lenis from 'lenis';
import { useEffect } from 'react';

declare global {
  interface Window {
    lenis: Lenis;
  }
}

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const handleAnimationFrame = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(handleAnimationFrame);
    };

    requestAnimationFrame(handleAnimationFrame);
    window.lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          lenis.scrollTo(href);
        }
      });
    })

    return () => {
      lenis.destroy();
    };
  }, []);
};

export default useLenis;
