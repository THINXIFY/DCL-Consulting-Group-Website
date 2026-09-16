import { MarketHero } from '@/components/market-entry-expansion-advisory/MarketHero';
import { MarketOurPerspectiveSection } from '@/components/market-entry-expansion-advisory/MarketOurPerspectiveSection';
import { KeyAreasOfMarketEntry } from '@/components/market-entry-expansion-advisory/KeyAreasOfMarketEntry';
import { MarketOurApproachSection } from '@/components/market-entry-expansion-advisory/MarketOurApproachSection';
import { MarketAreasOfFocusSection } from '@/components/market-entry-expansion-advisory/MarketAreasOfFocusSection';
import { MarketWhyDclSection } from '@/components/market-entry-expansion-advisory/MarketWhyDclSection';
import { MarketFinalCtaSection } from '@/components/market-entry-expansion-advisory/MarketFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function MarketEntryExpansionAdvisoryPage() {
  return (
    <>
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
