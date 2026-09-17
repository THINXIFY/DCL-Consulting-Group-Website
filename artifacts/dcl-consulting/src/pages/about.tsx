import { AboutHero } from '@/components/about/AboutHero';
import { WhoWeAre } from '@/components/about/WhoWeAre';
import { HowWeThink } from '@/components/about/HowWeThink';
import { WhatDefinesDcl } from '@/components/about/WhatDefinesDcl';
import { Leadership } from '@/components/about/Leadership';
import { CompanyFoundations } from '@/components/about/CompanyFoundations';
import { AboutFinalCta } from '@/components/about/AboutFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]);

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About DCL | Independent Investment & Strategic Advisory"
        description="Learn about DCL Consulting and Investments Limited, an independent investment consulting and strategic advisory firm supporting investors and businesses."
        path="/about"
        jsonLd={BREADCRUMB}
      />
      <main>
        <AboutHero />
        <WhoWeAre />
        <HowWeThink />
        <WhatDefinesDcl />
        <Leadership />
        <CompanyFoundations />
        <AboutFinalCta />
      </main>
      <Footer />
    </>
  );
}
