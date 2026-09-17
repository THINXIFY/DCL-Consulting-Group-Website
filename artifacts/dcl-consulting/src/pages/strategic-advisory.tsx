import { StrategicHero } from '@/components/strategic-advisory/StrategicHero';
import { StrategicOurPerspectiveSection } from '@/components/strategic-advisory/StrategicOurPerspectiveSection';
import { KeyAreasOfStrategicAdvisory } from '@/components/strategic-advisory/KeyAreasOfStrategicAdvisory';
import { StrategicOurApproachSection } from '@/components/strategic-advisory/StrategicOurApproachSection';
import { StrategicAreasOfFocusSection } from '@/components/strategic-advisory/StrategicAreasOfFocusSection';
import { StrategicWhyDclSection } from '@/components/strategic-advisory/StrategicWhyDclSection';
import { StrategicFinalCtaSection } from '@/components/strategic-advisory/StrategicFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Strategic Advisory', path: '/services/strategic-advisory' },
]);

export default function StrategicAdvisoryPage() {
  return (
    <>
      <Seo
        title="Strategic Advisory | DCL Consulting"
        description="DCL Consulting provides strategic advisory, offering independent perspective on growth, direction and strategic change for investors and businesses."
        path="/services/strategic-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <StrategicHero />
        <StrategicOurPerspectiveSection />
        <KeyAreasOfStrategicAdvisory />
        <StrategicOurApproachSection />
        <StrategicAreasOfFocusSection />
        <StrategicWhyDclSection />
        <StrategicFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
