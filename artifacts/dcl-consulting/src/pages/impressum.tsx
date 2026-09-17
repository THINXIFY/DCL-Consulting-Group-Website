import { ImpressumHero } from '@/components/impressum/ImpressumHero';
import { ImpressumContent } from '@/components/impressum/ImpressumContent';
import { ImpressumSupportCta } from '@/components/impressum/ImpressumSupportCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Impressum', path: '/impressum' },
]);

export default function ImpressumPage() {
  return (
    <>
      <Seo
        title="Impressum | DCL Consulting and Investments Limited"
        description="Impressum and verified legal company information for DCL Consulting and Investments Limited, a private limited company registered in England and Wales."
        path="/impressum"
        jsonLd={BREADCRUMB}
      />
      <main>
        <ImpressumHero />
        <ImpressumContent />
        <ImpressumSupportCta />
      </main>
      <Footer />
    </>
  );
}
