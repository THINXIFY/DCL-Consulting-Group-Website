import { AboutHero } from '@/components/about/AboutHero';
import { WhoWeAre } from '@/components/about/WhoWeAre';
import { HowWeThink } from '@/components/about/HowWeThink';
import { WhatDefinesDcl } from '@/components/about/WhatDefinesDcl';
import { Leadership } from '@/components/about/Leadership';
import { CompanyFoundations } from '@/components/about/CompanyFoundations';
import { AboutFinalCta } from '@/components/about/AboutFinalCta';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
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
