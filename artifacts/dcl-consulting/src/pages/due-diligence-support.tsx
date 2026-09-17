import { DueDiligenceHero } from '@/components/due-diligence-support/DueDiligenceHero';
import { DueDiligenceOurPerspectiveSection } from '@/components/due-diligence-support/DueDiligenceOurPerspectiveSection';
import { KeyAreasOfDueDiligence } from '@/components/due-diligence-support/KeyAreasOfDueDiligence';
import { DueDiligenceProcessSection } from '@/components/due-diligence-support/DueDiligenceProcessSection';
import { DueDiligenceAreasOfSupportSection } from '@/components/due-diligence-support/DueDiligenceAreasOfSupportSection';
import { DueDiligenceWhyDclSection } from '@/components/due-diligence-support/DueDiligenceWhyDclSection';
import { DueDiligenceFinalCtaSection } from '@/components/due-diligence-support/DueDiligenceFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Due Diligence Support', path: '/services/due-diligence-support' },
]);

export default function DueDiligenceSupportPage() {
  return (
    <>
      <Seo
        title="Due Diligence Support | DCL Consulting"
        description="DCL Consulting provides due diligence support, offering structured and independent review to inform important investment and business decisions."
        path="/services/due-diligence-support"
        jsonLd={BREADCRUMB}
      />
      <main>
        <DueDiligenceHero />
        <DueDiligenceOurPerspectiveSection />
        <KeyAreasOfDueDiligence />
        <DueDiligenceProcessSection />
        <DueDiligenceAreasOfSupportSection />
        <DueDiligenceWhyDclSection />
        <DueDiligenceFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
