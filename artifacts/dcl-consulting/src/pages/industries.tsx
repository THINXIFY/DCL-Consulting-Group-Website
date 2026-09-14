import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { SectorAgnostic } from '@/components/industries/SectorAgnostic';
import { IndustriesWeAssess } from '@/components/industries/IndustriesWeAssess';
import { Footer } from '@/components/Footer';

export default function IndustriesPage() {
  return (
    <>
      <main>
        <IndustriesHero />
        <SectorAgnostic />
        <IndustriesWeAssess />
      </main>
      <Footer />
    </>
  );
}
