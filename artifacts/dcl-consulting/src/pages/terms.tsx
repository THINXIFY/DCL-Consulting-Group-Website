import { TermsHero } from '@/components/terms/TermsHero';
import { TermsContent } from '@/components/terms/TermsContent';
import { TermsSupportCta } from '@/components/terms/TermsSupportCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Terms & Conditions', path: '/terms' },
]);

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions | DCL Consulting"
        description="Read the terms and conditions governing use of the DCL Consulting and Investments Limited website, content and investment advisory engagements."
        path="/terms"
        jsonLd={BREADCRUMB}
      />
      <main>
        <TermsHero />
        <TermsContent />
        <TermsSupportCta />
      </main>
      <Footer />
    </>
  );
}
