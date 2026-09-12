/**
 * Maps a 0..1 scroll progress value to an active index in a list of
 * `count` items, evenly dividing progress into `count` buckets.
 */
export function getActiveIndex(progress: number, count: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}
