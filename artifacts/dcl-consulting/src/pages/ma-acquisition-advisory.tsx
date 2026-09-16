import { MaHero } from '@/components/ma-acquisition-advisory/MaHero';
import { MaOurPerspectiveSection } from '@/components/ma-acquisition-advisory/MaOurPerspectiveSection';
import { KeyAreasOfMaAdvisory } from '@/components/ma-acquisition-advisory/KeyAreasOfMaAdvisory';
import { TransactionApproachSection } from '@/components/ma-acquisition-advisory/TransactionApproachSection';
import { TransactionFocusSection } from '@/components/ma-acquisition-advisory/TransactionFocusSection';
import { MaWhyDclSection } from '@/components/ma-acquisition-advisory/MaWhyDclSection';
import { MaFinalCtaSection } from '@/components/ma-acquisition-advisory/MaFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function MaAcquisitionAdvisoryPage() {
  return (
    <>
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
