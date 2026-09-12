import { AboutHero } from '@/components/about/AboutHero';
import { WhoWeAre } from '@/components/about/WhoWeAre';
import { HowWeThink } from '@/components/about/HowWeThink';
import { WhatDefinesDcl } from '@/components/about/WhatDefinesDcl';
import { Leadership } from '@/components/about/Leadership';

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <WhoWeAre />
      <HowWeThink />
      <WhatDefinesDcl />
      <Leadership />
    </main>
  );
}
