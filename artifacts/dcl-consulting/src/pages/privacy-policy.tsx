import { PrivacyHero } from '@/components/privacy/PrivacyHero';
import { PrivacyContent } from '@/components/privacy/PrivacyContent';
import { PrivacySupportCta } from '@/components/privacy/PrivacySupportCta';
import { Footer } from '@/components/Footer';
import { useDocumentMeta } from '@/hooks/use-document-meta';

export default function PrivacyPolicyPage() {
  useDocumentMeta(
    'Privacy Policy | DCL Consulting and Investments Limited',
    'Read the DCL Consulting and Investments Limited Privacy Policy, including how we handle enquiries, website information and secure document requests.',
  );

  return (
    <>
      <main>
        <PrivacyHero />
        <PrivacyContent />
        <PrivacySupportCta />
      </main>
      <Footer />
    </>
  );
}
