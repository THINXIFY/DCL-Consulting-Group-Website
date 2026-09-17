import { dclCompany } from '@/data/company';

// Single canonical production domain. Every canonical URL, OG/Twitter URL
// and structured-data URL in the app is built from this - never localhost,
// a VPS IP, a dev URL, or a www/non-www variant.
export const SITE_URL = 'https://dcl-consulting-group.com';
export const SITE_NAME = 'DCL Consulting';
export const DEFAULT_TITLE = 'DCL Consulting | Investment Consulting & Strategic Advisory';
export const DEFAULT_DESCRIPTION =
  'DCL Consulting and Investments Limited provides investment consulting, strategic advisory, financial analysis and decision support for investors and businesses.';
// The site's own wordmark - the only "premium DCL logo/brand image" that
// already exists, used as the default social-preview image.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand/dcl-logo.png`;

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Verified facts only, sourced from data/company.ts - the same source of
// truth already used by Team/Impressum/Footer. No phone number, social
// account, rating, review, award or regulatory licence is invented here.
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: dclCompany.name,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  email: dclCompany.email,
  identifier: {
    '@type': 'PropertyValue',
    name: 'Companies House Registration Number',
    value: dclCompany.number,
  },
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: `${dclCompany.registeredOfficeLines[0]}, ${dclCompany.registeredOfficeLines[1]}`,
      addressLocality: dclCompany.registeredOfficeLines[2],
      addressRegion: dclCompany.registeredOfficeLines[3],
      postalCode: dclCompany.registeredOfficeLines[5],
      addressCountry: 'GB',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: dclCompany.londonOfficeLines[0],
      addressLocality: dclCompany.londonOfficeLines[1],
      postalCode: dclCompany.londonOfficeLines[3],
      addressCountry: 'GB',
    },
  ],
};
