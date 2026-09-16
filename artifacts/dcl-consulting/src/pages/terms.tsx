import { TermsHero } from '@/components/terms/TermsHero';
import { TermsContent } from '@/components/terms/TermsContent';
import { TermsSupportCta } from '@/components/terms/TermsSupportCta';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <main>
        <TermsHero />
        <TermsContent />
        <TermsSupportCta />
      </main>
      <Footer />
    </>
  );
}
