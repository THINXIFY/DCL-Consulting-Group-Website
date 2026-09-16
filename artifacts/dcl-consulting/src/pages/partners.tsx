import { PartnersHero } from '@/components/partners/PartnersHero';
import { WhyPartnershipsMatter } from '@/components/partners/WhyPartnershipsMatter';
import { HowWeWorkWithPartners } from '@/components/partners/HowWeWorkWithPartners';
import { PartnershipAreas } from '@/components/partners/PartnershipAreas';
import { WhatWeValue } from '@/components/partners/WhatWeValue';
import { InternationalPerspective } from '@/components/partners/InternationalPerspective';
import { PartnersFinalCta } from '@/components/partners/PartnersFinalCta';
import { Footer } from '@/components/Footer';

export default function PartnersPage() {
  return (
    <>
      <main>
        <PartnersHero />
        <WhyPartnershipsMatter />
        <HowWeWorkWithPartners />
        <PartnershipAreas />
        <WhatWeValue />
        <InternationalPerspective />
        <PartnersFinalCta />
      </main>
      <Footer />
    </>
  );
}
