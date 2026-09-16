import { useLayoutEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Resets scroll to the top of the page whenever the route changes.
 * Runs in useLayoutEffect (before paint) so there's no visible flash of
 * the previous page's scroll position. Only fires on real route changes
 * (wouter's `location`, pathname only) - same-page hash links (plain
 * `<a href="#section">`) never touch this, so their native browser
 * anchor-scroll behavior is left alone.
 */
export function useScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
}
