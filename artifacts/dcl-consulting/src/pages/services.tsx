import { ServicesHero } from '@/components/services/ServicesHero';
import { ServiceDirectory } from '@/components/services/ServiceDirectory';
import { HowWeWork } from '@/components/services/HowWeWork';
import { WhyChooseDcl } from '@/components/services/WhyChooseDcl';
import { SelectedServices } from '@/components/services/SelectedServices';
import { ServicesFaq } from '@/components/services/ServicesFaq';
import { ServicesFinalCta } from '@/components/services/ServicesFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]);

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Investment Consulting & Advisory Services | DCL Consulting"
        description="Explore DCL Consulting's investment consulting, strategic advisory, asset and wealth services for investors and businesses seeking independent perspective."
        path="/services"
        jsonLd={BREADCRUMB}
      />
      <main>
        <ServicesHero />
        <ServiceDirectory />
        <HowWeWork />
        <WhyChooseDcl />
        <SelectedServices />
        <ServicesFaq />
        <ServicesFinalCta />
      </main>
      <Footer />
    </>
  );
}
