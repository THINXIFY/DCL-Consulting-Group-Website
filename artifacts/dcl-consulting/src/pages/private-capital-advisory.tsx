import { PrivateCapitalHero } from '@/components/private-capital-advisory/PrivateCapitalHero';
import { PrivateCapitalOurPerspectiveSection } from '@/components/private-capital-advisory/PrivateCapitalOurPerspectiveSection';
import { KeyAreasOfPrivateCapitalAdvisory } from '@/components/private-capital-advisory/KeyAreasOfPrivateCapitalAdvisory';
import { InvestmentApproachSection } from '@/components/private-capital-advisory/InvestmentApproachSection';
import { InvestmentFocusSection } from '@/components/private-capital-advisory/InvestmentFocusSection';
import { PrivateCapitalWhyDclSection } from '@/components/private-capital-advisory/PrivateCapitalWhyDclSection';
import { PrivateCapitalFinalCtaSection } from '@/components/private-capital-advisory/PrivateCapitalFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Private Capital Advisory', path: '/services/private-capital-advisory' },
]);

export default function PrivateCapitalAdvisoryPage() {
  return (
    <>
      <Seo
        title="Private Capital Advisory | DCL Consulting"
        description="DCL Consulting provides independent private capital advisory, supporting investors and businesses evaluating private-capital opportunities and structures."
        path="/services/private-capital-advisory"
        jsonLd={BREADCRUMB}
      />
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
