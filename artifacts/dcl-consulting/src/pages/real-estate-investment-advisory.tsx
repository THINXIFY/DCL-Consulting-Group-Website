import { RealEstateHero } from '@/components/real-estate-investment-advisory/RealEstateHero';
import { OurPerspective } from '@/components/real-estate-investment-advisory/OurPerspective';
import { WhatWeAssess } from '@/components/real-estate-investment-advisory/WhatWeAssess';
import { HowWeEvaluate } from '@/components/real-estate-investment-advisory/HowWeEvaluate';
import { CommercialFinancial } from '@/components/real-estate-investment-advisory/CommercialFinancial';
import { RiskDueDiligence } from '@/components/real-estate-investment-advisory/RiskDueDiligence';
import { WhereWeSupport } from '@/components/real-estate-investment-advisory/WhereWeSupport';
import { WhyDcl } from '@/components/real-estate-investment-advisory/WhyDcl';
import { RealEstateFinalCta } from '@/components/real-estate-investment-advisory/RealEstateFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Real Estate Investment Advisory', path: '/services/real-estate-investment-advisory' },
]);

export default function RealEstateInvestmentAdvisoryPage() {
  return (
    <>
      <Seo
        title="Real Estate Investment Advisory | DCL Consulting"
        description="DCL Consulting offers real estate investment advisory, bringing commercial and strategic perspective to property and real-estate opportunities."
        path="/services/real-estate-investment-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <RealEstateHero />
        <OurPerspective />
        <WhatWeAssess />
        <HowWeEvaluate />
        <CommercialFinancial />
        <RiskDueDiligence />
        <WhereWeSupport />
        <WhyDcl />
        <RealEstateFinalCta />
      </main>
      <Footer />
    </>
  );
}
