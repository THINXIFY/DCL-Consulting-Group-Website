import { StrategicHero } from '@/components/strategic-advisory/StrategicHero';
import { StrategicOurPerspectiveSection } from '@/components/strategic-advisory/StrategicOurPerspectiveSection';
import { KeyAreasOfStrategicAdvisory } from '@/components/strategic-advisory/KeyAreasOfStrategicAdvisory';
import { StrategicOurApproachSection } from '@/components/strategic-advisory/StrategicOurApproachSection';
import { StrategicAreasOfFocusSection } from '@/components/strategic-advisory/StrategicAreasOfFocusSection';
import { StrategicWhyDclSection } from '@/components/strategic-advisory/StrategicWhyDclSection';
import { StrategicFinalCtaSection } from '@/components/strategic-advisory/StrategicFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function StrategicAdvisoryPage() {
  return (
    <>
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
