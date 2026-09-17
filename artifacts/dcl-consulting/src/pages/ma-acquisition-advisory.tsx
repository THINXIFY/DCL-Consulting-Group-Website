import { MaHero } from '@/components/ma-acquisition-advisory/MaHero';
import { MaOurPerspectiveSection } from '@/components/ma-acquisition-advisory/MaOurPerspectiveSection';
import { KeyAreasOfMaAdvisory } from '@/components/ma-acquisition-advisory/KeyAreasOfMaAdvisory';
import { TransactionApproachSection } from '@/components/ma-acquisition-advisory/TransactionApproachSection';
import { TransactionFocusSection } from '@/components/ma-acquisition-advisory/TransactionFocusSection';
import { MaWhyDclSection } from '@/components/ma-acquisition-advisory/MaWhyDclSection';
import { MaFinalCtaSection } from '@/components/ma-acquisition-advisory/MaFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'M&A & Acquisition Advisory', path: '/services/ma-acquisition-advisory' },
]);

export default function MaAcquisitionAdvisoryPage() {
  return (
    <>
      <Seo
        title="M&A & Acquisition Advisory | DCL Consulting"
        description="DCL Consulting provides M&A and acquisition advisory, offering strategic analysis and independent perspective around significant transactions."
        path="/services/ma-acquisition-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <MaHero />
        <MaOurPerspectiveSection />
        <KeyAreasOfMaAdvisory />
        <TransactionApproachSection />
        <TransactionFocusSection />
        <MaWhyDclSection />
        <MaFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
