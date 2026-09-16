import { DueDiligenceHero } from '@/components/due-diligence-support/DueDiligenceHero';
import { DueDiligenceOurPerspectiveSection } from '@/components/due-diligence-support/DueDiligenceOurPerspectiveSection';
import { KeyAreasOfDueDiligence } from '@/components/due-diligence-support/KeyAreasOfDueDiligence';
import { DueDiligenceProcessSection } from '@/components/due-diligence-support/DueDiligenceProcessSection';
import { DueDiligenceAreasOfSupportSection } from '@/components/due-diligence-support/DueDiligenceAreasOfSupportSection';
import { DueDiligenceWhyDclSection } from '@/components/due-diligence-support/DueDiligenceWhyDclSection';
import { DueDiligenceFinalCtaSection } from '@/components/due-diligence-support/DueDiligenceFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function DueDiligenceSupportPage() {
  return (
    <>
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
