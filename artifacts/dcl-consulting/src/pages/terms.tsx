import { TermsHero } from '@/components/terms/TermsHero';
import { TermsContent } from '@/components/terms/TermsContent';
import { TermsSupportCta } from '@/components/terms/TermsSupportCta';
import { Footer } from '@/components/Footer';
import { useDocumentMeta } from '@/hooks/use-document-meta';

export default function TermsPage() {
  useDocumentMeta(
    'Terms & Conditions | DCL Consulting and Investments Limited',
    'Read the terms governing access to and use of the DCL Consulting and Investments Limited website.',
  );

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
