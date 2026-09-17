import { useEffect } from 'react';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    const created = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => {
      if (key !== 'content') created.setAttribute(key, value);
    });
    document.head.appendChild(created);
    el = created;
  }
  el.setAttribute('content', attrs.content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Centralized per-route metadata. Imperatively upserts (rather than
 * removes/recreates) each tag so there's never more than one of any given
 * meta/link/script on the page across route changes, and mounts/unmounts
 * cleanly for a client-rendered SPA with no server-side rendering step.
 */
export function Seo({ title, description, path, image, noindex, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' });

    const url = absoluteUrl(path);
    const ogImage = image ?? DEFAULT_OG_IMAGE;
    upsertLink('canonical', url);
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, noindex, jsonLd]);

  return null;
}
