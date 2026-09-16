import { PrivateCapitalHero } from '@/components/private-capital-advisory/PrivateCapitalHero';
import { PrivateCapitalOurPerspectiveSection } from '@/components/private-capital-advisory/PrivateCapitalOurPerspectiveSection';
import { KeyAreasOfPrivateCapitalAdvisory } from '@/components/private-capital-advisory/KeyAreasOfPrivateCapitalAdvisory';
import { InvestmentApproachSection } from '@/components/private-capital-advisory/InvestmentApproachSection';
import { InvestmentFocusSection } from '@/components/private-capital-advisory/InvestmentFocusSection';
import { PrivateCapitalWhyDclSection } from '@/components/private-capital-advisory/PrivateCapitalWhyDclSection';
import { PrivateCapitalFinalCtaSection } from '@/components/private-capital-advisory/PrivateCapitalFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function PrivateCapitalAdvisoryPage() {
  return (
    <>
      <main>
        <PrivateCapitalHero />
        <PrivateCapitalOurPerspectiveSection />
        <KeyAreasOfPrivateCapitalAdvisory />
        <InvestmentApproachSection />
        <InvestmentFocusSection />
        <PrivateCapitalWhyDclSection />
        <PrivateCapitalFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
