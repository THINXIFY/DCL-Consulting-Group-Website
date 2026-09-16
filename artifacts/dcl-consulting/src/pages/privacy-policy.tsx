import { PrivacyHero } from '@/components/privacy/PrivacyHero';
import { PrivacyContent } from '@/components/privacy/PrivacyContent';
import { PrivacySupportCta } from '@/components/privacy/PrivacySupportCta';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
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
