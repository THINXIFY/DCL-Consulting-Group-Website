import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

interface MagneticOptions {
  /** How far the element travels relative to the cursor offset (0..1). */
  strength?: number;
}

/**
 * Pulls the referenced element toward the cursor while hovering, and
 * springs it back on leave. No-ops on touch/coarse pointers and when
 * the user prefers reduced motion, so it never fights a tap target.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, { strength = 0.35 }: MagneticOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power2.out' });

    function handleMove(event: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    }

    function handleEnter() {
      scaleTo(1.045);
    }

    function handleLeave() {
      xTo(0);
      yTo(0);
      scaleTo(1);
    }

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [ref, strength]);
}
