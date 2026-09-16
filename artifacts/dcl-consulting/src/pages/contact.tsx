import { ContactHero } from '@/components/contact/ContactHero';
import { HowCanWeHelp } from '@/components/contact/HowCanWeHelp';
import { CompanyInformation } from '@/components/contact/CompanyInformation';
import { GetInTouchBand } from '@/components/contact/GetInTouchBand';
import { WhatHappensNext } from '@/components/contact/WhatHappensNext';
import { ContactSupportCta } from '@/components/contact/ContactSupportCta';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
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
