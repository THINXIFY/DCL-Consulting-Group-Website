import { PartnersHero } from '@/components/partners/PartnersHero';
import { WhyPartnershipsMatter } from '@/components/partners/WhyPartnershipsMatter';
import { HowWeWorkWithPartners } from '@/components/partners/HowWeWorkWithPartners';
import { PartnershipAreas } from '@/components/partners/PartnershipAreas';
import { WhatWeValue } from '@/components/partners/WhatWeValue';
import { InternationalPerspective } from '@/components/partners/InternationalPerspective';
import { PartnersFinalCta } from '@/components/partners/PartnersFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Partners', path: '/partners' },
]);

export default function PartnersPage() {
  return (
    <>
      <Seo
        title="Strategic Partnerships | DCL Consulting"
        description="DCL Consulting works with strategic partners across investment, advisory and international opportunities, sharing an independent, long-term perspective."
        path="/partners"
        jsonLd={BREADCRUMB}
      />
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
