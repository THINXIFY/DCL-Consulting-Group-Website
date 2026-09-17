import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Seo } from './Seo';

function head(selector: string) {
  return document.head.querySelector(selector);
}

describe('Seo', () => {
  afterEach(() => {
    document.head.querySelectorAll('meta, link[rel="canonical"], script[data-seo-jsonld]').forEach((el) => el.remove());
    document.title = '';
  });

  it('sets the document title and meta description', () => {
    render(<Seo title="Page Title | DCL Consulting" description="A page description." path="/about" />);
    expect(document.title).toBe('Page Title | DCL Consulting');
    expect(head('meta[name="description"]')).toHaveAttribute('content', 'A page description.');
  });

  it('sets a canonical URL on the real production domain, never localhost or a dev URL', () => {
    render(<Seo title="T" description="D" path="/about" />);
    const canonical = head('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://dcl-consulting-group.com/about');
    expect(canonical?.getAttribute('href')).not.toMatch(/localhost|127\.0\.0\.1|\.vps\.|:\d{4,5}/);
  });

  it('sets the canonical URL for the homepage to the bare domain, with no trailing path', () => {
    render(<Seo title="T" description="D" path="/" />);
    expect(head('link[rel="canonical"]')).toHaveAttribute('href', 'https://dcl-consulting-group.com');
  });

  it('sets complete Open Graph metadata, defaulting the image to the DCL brand logo', () => {
    render(<Seo title="T" description="D" path="/services" />);
    expect(head('meta[property="og:site_name"]')).toHaveAttribute('content', 'DCL Consulting');
    expect(head('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    expect(head('meta[property="og:title"]')).toHaveAttribute('content', 'T');
    expect(head('meta[property="og:description"]')).toHaveAttribute('content', 'D');
    expect(head('meta[property="og:url"]')).toHaveAttribute('content', 'https://dcl-consulting-group.com/services');
    expect(head('meta[property="og:image"]')).toHaveAttribute('content', 'https://dcl-consulting-group.com/images/brand/dcl-logo.png');
  });

  it('accepts a page-specific OG/Twitter image override', () => {
    render(<Seo title="T" description="D" path="/team" image="https://dcl-consulting-group.com/images/general/team.webp" />);
    expect(head('meta[property="og:image"]')).toHaveAttribute('content', 'https://dcl-consulting-group.com/images/general/team.webp');
    expect(head('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://dcl-consulting-group.com/images/general/team.webp');
  });

  it('sets a summary_large_image Twitter card with matching title/description', () => {
    render(<Seo title="T" description="D" path="/contact" />);
    expect(head('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    expect(head('meta[name="twitter:title"]')).toHaveAttribute('content', 'T');
    expect(head('meta[name="twitter:description"]')).toHaveAttribute('content', 'D');
  });

  it('defaults to index, follow, and switches to noindex, nofollow only when explicitly requested', () => {
    const { rerender } = render(<Seo title="T" description="D" path="/insights/some-post" />);
    expect(head('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');

    rerender(<Seo title="T" description="D" path="/insights/some-post" noindex />);
    expect(head('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  it('injects JSON-LD structured data as a single script tag, and removes it if the page stops passing any', () => {
    const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'DCL Consulting and Investments Limited' };
    const { rerender } = render(<Seo title="T" description="D" path="/" jsonLd={org} />);
    const script = head('script[data-seo-jsonld]');
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute('type', 'application/ld+json');
    expect(JSON.parse(script!.textContent!)).toEqual(org);

    rerender(<Seo title="T" description="D" path="/" />);
    expect(head('script[data-seo-jsonld]')).toBeNull();
  });

  it('never leaves duplicate tags behind across a route change (upserts in place)', () => {
    const { rerender } = render(<Seo title="First" description="First desc" path="/about" />);
    rerender(<Seo title="Second" description="Second desc" path="/services" />);

    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(document.title).toBe('Second');
    expect(head('link[rel="canonical"]')).toHaveAttribute('href', 'https://dcl-consulting-group.com/services');
  });
});
