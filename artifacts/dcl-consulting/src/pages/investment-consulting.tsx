import { InvestmentConsultingHero } from '@/components/investment-consulting/InvestmentConsultingHero';
import { OurApproachSection } from '@/components/investment-consulting/OurApproachSection';
import { WhatWeEvaluate } from '@/components/investment-consulting/WhatWeEvaluate';
import { InvestmentAnalysis } from '@/components/investment-consulting/InvestmentAnalysis';
import { AreasOfFocus } from '@/components/investment-consulting/AreasOfFocus';
import { InvestmentWhyDclSection } from '@/components/investment-consulting/InvestmentWhyDclSection';
import { InvestmentFinalCtaSection } from '@/components/investment-consulting/InvestmentFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function InvestmentConsultingPage() {
  return (
    <>
      <main>
        <InvestmentConsultingHero />
        <OurApproachSection />
        <WhatWeEvaluate />
        <InvestmentAnalysis />
        <AreasOfFocus />
        <InvestmentWhyDclSection />
        <InvestmentFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
