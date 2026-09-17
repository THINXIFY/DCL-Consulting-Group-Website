import { MarketHero } from '@/components/market-entry-expansion-advisory/MarketHero';
import { MarketOurPerspectiveSection } from '@/components/market-entry-expansion-advisory/MarketOurPerspectiveSection';
import { KeyAreasOfMarketEntry } from '@/components/market-entry-expansion-advisory/KeyAreasOfMarketEntry';
import { MarketOurApproachSection } from '@/components/market-entry-expansion-advisory/MarketOurApproachSection';
import { MarketAreasOfFocusSection } from '@/components/market-entry-expansion-advisory/MarketAreasOfFocusSection';
import { MarketWhyDclSection } from '@/components/market-entry-expansion-advisory/MarketWhyDclSection';
import { MarketFinalCtaSection } from '@/components/market-entry-expansion-advisory/MarketFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Market Entry & Expansion Advisory', path: '/services/market-entry-expansion-advisory' },
]);

export default function MarketEntryExpansionAdvisoryPage() {
  return (
    <>
      <Seo
        title="Market Entry & Expansion Advisory | DCL Consulting"
        description="DCL Consulting provides market entry and expansion advisory, bringing commercial perspective to new markets and long-term growth opportunities."
        path="/services/market-entry-expansion-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <MarketHero />
        <MarketOurPerspectiveSection />
        <KeyAreasOfMarketEntry />
        <MarketOurApproachSection />
        <MarketAreasOfFocusSection />
        <MarketWhyDclSection />
        <MarketFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
