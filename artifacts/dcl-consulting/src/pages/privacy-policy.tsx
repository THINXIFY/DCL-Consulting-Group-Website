import { PrivacyHero } from '@/components/privacy/PrivacyHero';
import { PrivacyContent } from '@/components/privacy/PrivacyContent';
import { PrivacySupportCta } from '@/components/privacy/PrivacySupportCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
]);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy | DCL Consulting"
        description="Read the DCL Consulting and Investments Limited privacy policy explaining how personal data is collected, used, protected and your related rights."
        path="/privacy-policy"
        jsonLd={BREADCRUMB}
      />
      <main>
        <PrivacyHero />
        <PrivacyContent />
        <PrivacySupportCta />
      </main>
      <Footer />
    </>
  );
}
