import { RiskHero } from '@/components/risk-opportunity-assessment/RiskHero';
import { RiskOurPerspectiveSection } from '@/components/risk-opportunity-assessment/RiskOurPerspectiveSection';
import { KeyAreasOfRiskAssessment } from '@/components/risk-opportunity-assessment/KeyAreasOfRiskAssessment';
import { RiskOurApproachSection } from '@/components/risk-opportunity-assessment/RiskOurApproachSection';
import { RiskAreasOfSupportSection } from '@/components/risk-opportunity-assessment/RiskAreasOfSupportSection';
import { RiskWhyDclSection } from '@/components/risk-opportunity-assessment/RiskWhyDclSection';
import { RiskFinalCtaSection } from '@/components/risk-opportunity-assessment/RiskFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function RiskOpportunityAssessmentPage() {
  return (
    <>
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
