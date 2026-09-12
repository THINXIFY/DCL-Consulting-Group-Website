import { useEffect } from 'react';
import { ensureGsapRegistered, ScrollTrigger } from '@/lib/gsap';

/**
 * Re-measures every ScrollTrigger once fonts, images, and the window
 * finish loading, so trigger start/end positions aren't calculated
 * against a pre-load layout that then shifts underneath them.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    ensureGsapRegistered();
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', refresh, { once: true });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    const pendingImages = Array.from(document.images).filter((img) => !img.complete);
    pendingImages.forEach((img) => img.addEventListener('load', refresh, { once: true }));

    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
      pendingImages.forEach((img) => img.removeEventListener('load', refresh));
    };
  }, []);
}
