import { ServicesHero } from '@/components/services/ServicesHero';
import { ServiceDirectory } from '@/components/services/ServiceDirectory';
import { HowWeWork } from '@/components/services/HowWeWork';
import { WhyChooseDcl } from '@/components/services/WhyChooseDcl';
import { SelectedServices } from '@/components/services/SelectedServices';
import { ServicesFaq } from '@/components/services/ServicesFaq';
import { ServicesFinalCta } from '@/components/services/ServicesFinalCta';
import { Footer } from '@/components/Footer';

export default function ServicesPage() {
  return (
    <>
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
