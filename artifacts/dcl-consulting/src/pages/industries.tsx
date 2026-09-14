import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { SectorAgnostic } from '@/components/industries/SectorAgnostic';
import { IndustriesWeAssess } from '@/components/industries/IndustriesWeAssess';
import { WhatWeLookFor } from '@/components/industries/WhatWeLookFor';
import { SectorPerspectiveMatters } from '@/components/industries/SectorPerspectiveMatters';
import { CrossSectorPerspective } from '@/components/industries/CrossSectorPerspective';
import { IndustriesFinalCta } from '@/components/industries/IndustriesFinalCta';
import { Footer } from '@/components/Footer';

export default function IndustriesPage() {
  return (
    <>
      <main>
        <IndustriesHero />
        <SectorAgnostic />
        <IndustriesWeAssess />
        <WhatWeLookFor />
        <SectorPerspectiveMatters />
        <CrossSectorPerspective />
        <IndustriesFinalCta />
      </main>
      <Footer />
    </>
  );
}
