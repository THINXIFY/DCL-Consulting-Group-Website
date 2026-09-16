import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

type FadeInImageProps = ImgHTMLAttributes<HTMLImageElement>;

type Status = 'pending' | 'loaded-instant' | 'loaded-animated';

/**
 * Drop-in <img> replacement that fades in once the image has actually
 * finished loading, instead of popping in abruptly. Already-cached images
 * (checked via `img.complete` before paint) reveal instantly with no fade,
 * so repeat views never show a needless animation.
 *
 * Uses a CSS `animation` (see `.dclFadeInImage` in index.css) rather than
 * a `transition-opacity` utility class, because several callers already
 * apply their own `transition-transform` for hover effects on the same
 * <img> - two `transition-*` utilities would both set `transition-property`
 * and silently cancel one another out. An `animation` is independent of
 * `transition-property`, so it can never conflict. The site's global
 * `prefers-reduced-motion` rule (index.css) already collapses all
 * animation durations to ~0, so no separate reduced-motion handling is
 * needed here.
 */
export const FadeInImage = forwardRef<HTMLImageElement, FadeInImageProps>(function FadeInImage(
  { className = '', onLoad, ...props },
  forwardedRef,
) {
  const innerRef = useRef<HTMLImageElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLImageElement);
  const [status, setStatus] = useState<Status>('pending');

  useLayoutEffect(() => {
    if (innerRef.current?.complete) setStatus('loaded-instant');
  }, []);

  const revealClass = status === 'pending' ? 'opacity-0' : status === 'loaded-animated' ? 'dclFadeInImage opacity-100' : 'opacity-100';

  return (
    <img
      {...props}
      ref={innerRef}
      className={`${className} ${revealClass}`}
      onLoad={(event) => {
        setStatus((current) => (current === 'pending' ? 'loaded-animated' : current));
        onLoad?.(event);
      }}
    />
  );
});
