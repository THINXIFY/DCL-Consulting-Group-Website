import { WealthHero } from '@/components/wealth-strategy-advisory/WealthHero';
import { WealthOurPerspectiveSection } from '@/components/wealth-strategy-advisory/WealthOurPerspectiveSection';
import { KeyAreasOfWealthStrategy } from '@/components/wealth-strategy-advisory/KeyAreasOfWealthStrategy';
import { WealthOurApproachSection } from '@/components/wealth-strategy-advisory/WealthOurApproachSection';
import { AreasOfSupportSection } from '@/components/wealth-strategy-advisory/AreasOfSupportSection';
import { WealthWhyDclSection } from '@/components/wealth-strategy-advisory/WealthWhyDclSection';
import { WealthFinalCtaSection } from '@/components/wealth-strategy-advisory/WealthFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Wealth Strategy Advisory', path: '/services/wealth-strategy-advisory' },
]);

export default function WealthStrategyAdvisoryPage() {
  return (
    <>
      <Seo
        title="Wealth Strategy Advisory | DCL Consulting"
        description="DCL Consulting provides wealth strategy advisory, offering long-term independent perspective around wealth priorities and significant capital decisions."
        path="/services/wealth-strategy-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <WealthHero />
        <WealthOurPerspectiveSection />
        <KeyAreasOfWealthStrategy />
        <WealthOurApproachSection />
        <AreasOfSupportSection />
        <WealthWhyDclSection />
        <WealthFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
