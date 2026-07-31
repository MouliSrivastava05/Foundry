import { useEffect } from 'react'

/**
 * useScrollAnimation
 *
 * Attaches an IntersectionObserver to every element with `[data-animate]`
 * inside the given container (defaults to document.body).
 * When an element scrolls into view, the `is-visible` class is added,
 * triggering the CSS transition defined on `.scroll-animate`.
 *
 * Usage in JSX:
 *   <div className="scroll-animate" data-animate>content</div>
 *   <div className="scroll-animate delay-2" data-animate>content</div>
 */
export function useScrollAnimation(containerRef?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef?.current ?? document

    const targets = root.querySelectorAll<HTMLElement>('[data-animate]')

    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Unobserve after triggering — animation plays once
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,     // trigger when 12% visible
        rootMargin: '0px 0px -40px 0px', // slightly before full entry
      }
    )

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [containerRef])
}
