import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { OurIndustries } from '@/components/industries/OurIndustries';
import { GlobalPerspective } from '@/components/industries/GlobalPerspective';
import { WhatWeLookFor } from '@/components/industries/WhatWeLookFor';
import { WhereSectorPerspectiveMatters } from '@/components/industries/WhereSectorPerspectiveMatters';
import { IndustriesFinalCta } from '@/components/industries/IndustriesFinalCta';
import { Footer } from '@/components/Footer';

export default function IndustriesPage() {
  return (
    <>
      <main>
        <IndustriesHero />
        <OurIndustries />
        <GlobalPerspective />
        <WhatWeLookFor />
        <WhereSectorPerspectiveMatters />
        <IndustriesFinalCta />
      </main>
      <Footer />
    </>
  );
}
