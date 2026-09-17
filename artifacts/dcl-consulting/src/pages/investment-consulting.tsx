import { InvestmentConsultingHero } from '@/components/investment-consulting/InvestmentConsultingHero';
import { OurApproachSection } from '@/components/investment-consulting/OurApproachSection';
import { WhatWeEvaluate } from '@/components/investment-consulting/WhatWeEvaluate';
import { InvestmentAnalysis } from '@/components/investment-consulting/InvestmentAnalysis';
import { AreasOfFocus } from '@/components/investment-consulting/AreasOfFocus';
import { InvestmentWhyDclSection } from '@/components/investment-consulting/InvestmentWhyDclSection';
import { InvestmentFinalCtaSection } from '@/components/investment-consulting/InvestmentFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Investment Consulting', path: '/services/investment-consulting' },
]);

export default function InvestmentConsultingPage() {
  return (
    <>
      <Seo
        title="Investment Consulting Services | DCL Consulting"
        description="DCL Consulting provides independent investment consulting, offering objective perspective and structured analysis around significant investment decisions."
        path="/services/investment-consulting"
        jsonLd={BREADCRUMB}
      />
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
