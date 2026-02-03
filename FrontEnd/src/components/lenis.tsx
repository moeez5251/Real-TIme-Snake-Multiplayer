import Lenis from 'lenis'
import { useEffect } from 'react'

const useLenis = () => {
  useEffect(() => {
    const container = document.querySelector(
      'main[data-lenis]'
    ) as HTMLElement | null

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wrapper: container || undefined,
      content: container || undefined,
    })

    let rafId: number

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}

export default useLenis
