import { useEffect } from 'react';

/**
 * Sets the document title and meta description for the current page,
 * restoring the previous values on unmount so navigating away (in this
 * single-page app) does not leak one page's metadata into another.
 */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute('content') ?? null;

    document.title = title;
    descriptionTag?.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) descriptionTag?.setAttribute('content', previousDescription);
    };
  }, [title, description]);
}
