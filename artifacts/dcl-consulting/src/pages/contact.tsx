import { ContactHero } from '@/components/contact/ContactHero';
import { HowCanWeHelp } from '@/components/contact/HowCanWeHelp';
import { CompanyInformation } from '@/components/contact/CompanyInformation';
import { GetInTouchBand } from '@/components/contact/GetInTouchBand';
import { WhatHappensNext } from '@/components/contact/WhatHappensNext';
import { ContactSupportCta } from '@/components/contact/ContactSupportCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]);

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact DCL Consulting | Investment & Strategic Advisory"
        description="Contact DCL Consulting and Investments Limited to discuss investment opportunities, strategic decisions or a potential advisory engagement today."
        path="/contact"
        jsonLd={BREADCRUMB}
      />
      <main>
        <ContactHero />
        <HowCanWeHelp />
        <CompanyInformation />
        <GetInTouchBand />
        <WhatHappensNext />
        <ContactSupportCta />
      </main>
      <Footer />
    </>
  );
}
