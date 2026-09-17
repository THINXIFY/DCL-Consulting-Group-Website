import { RiskHero } from '@/components/risk-opportunity-assessment/RiskHero';
import { RiskOurPerspectiveSection } from '@/components/risk-opportunity-assessment/RiskOurPerspectiveSection';
import { KeyAreasOfRiskAssessment } from '@/components/risk-opportunity-assessment/KeyAreasOfRiskAssessment';
import { RiskOurApproachSection } from '@/components/risk-opportunity-assessment/RiskOurApproachSection';
import { RiskAreasOfSupportSection } from '@/components/risk-opportunity-assessment/RiskAreasOfSupportSection';
import { RiskWhyDclSection } from '@/components/risk-opportunity-assessment/RiskWhyDclSection';
import { RiskFinalCtaSection } from '@/components/risk-opportunity-assessment/RiskFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Risk & Opportunity Assessment', path: '/services/risk-opportunity-assessment' },
]);

export default function RiskOpportunityAssessmentPage() {
  return (
    <>
      <Seo
        title="Risk & Opportunity Assessment | DCL Consulting"
        description="DCL Consulting provides risk and opportunity assessment, offering balanced analysis of uncertainty, upside and other material considerations."
        path="/services/risk-opportunity-assessment"
        jsonLd={BREADCRUMB}
      />
      <main>
        <RiskHero />
        <RiskOurPerspectiveSection />
        <KeyAreasOfRiskAssessment />
        <RiskOurApproachSection />
        <RiskAreasOfSupportSection />
        <RiskWhyDclSection />
        <RiskFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
