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

export default function RealEstateInvestmentAdvisoryPage() {
  return (
    <>
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
