import { ImpressumHero } from '@/components/impressum/ImpressumHero';
import { ImpressumContent } from '@/components/impressum/ImpressumContent';
import { ImpressumSupportCta } from '@/components/impressum/ImpressumSupportCta';
import { Footer } from '@/components/Footer';

export default function ImpressumPage() {
  return (
    <>
      <main>
        <ImpressumHero />
        <ImpressumContent />
        <ImpressumSupportCta />
      </main>
      <Footer />
    </>
  );
}
