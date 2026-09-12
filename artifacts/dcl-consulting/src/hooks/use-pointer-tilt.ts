import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

interface PointerTiltOptions {
  /** Maximum rotation in degrees applied on each axis. */
  maxRotateX?: number;
  maxRotateY?: number;
}

/**
 * Tilts the referenced 3D container toward the cursor position within the
 * viewport, for a subtle perspective effect. No-ops on touch/coarse
 * pointers and when the user prefers reduced motion.
 */
export function usePointerTilt(ref: RefObject<HTMLElement | null>, { maxRotateX = 2, maxRotateY = 3 }: PointerTiltOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rotateXTo = gsap.quickTo(el, 'rotateX', { duration: 0.7, ease: 'power3.out' });
    const rotateYTo = gsap.quickTo(el, 'rotateY', { duration: 0.7, ease: 'power3.out' });

    function handleMove(event: MouseEvent) {
      const relX = event.clientX / window.innerWidth - 0.5;
      const relY = event.clientY / window.innerHeight - 0.5;
      rotateYTo(relX * maxRotateY * 2);
      rotateXTo(relY * -maxRotateX * 2);
    }

    function handleLeave() {
      rotateXTo(0);
      rotateYTo(0);
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      gsap.set(el, { clearProps: 'rotateX,rotateY' });
    };
  }, [ref, maxRotateX, maxRotateY]);
}
