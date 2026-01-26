import Lenis from 'lenis';
import { useEffect } from 'react';
const useLenis = (t: number) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration:t,
      easing: (t: number) => t, // Linear easing; you can customize
      gestureOrientation: 'vertical',
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy(); // Cleanup on unmount
  }, []);
};

export default useLenis;
