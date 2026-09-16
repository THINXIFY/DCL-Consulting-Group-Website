import { WealthHero } from '@/components/wealth-strategy-advisory/WealthHero';
import { WealthOurPerspectiveSection } from '@/components/wealth-strategy-advisory/WealthOurPerspectiveSection';
import { KeyAreasOfWealthStrategy } from '@/components/wealth-strategy-advisory/KeyAreasOfWealthStrategy';
import { WealthOurApproachSection } from '@/components/wealth-strategy-advisory/WealthOurApproachSection';
import { AreasOfSupportSection } from '@/components/wealth-strategy-advisory/AreasOfSupportSection';
import { WealthWhyDclSection } from '@/components/wealth-strategy-advisory/WealthWhyDclSection';
import { WealthFinalCtaSection } from '@/components/wealth-strategy-advisory/WealthFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function WealthStrategyAdvisoryPage() {
  return (
    <>
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
