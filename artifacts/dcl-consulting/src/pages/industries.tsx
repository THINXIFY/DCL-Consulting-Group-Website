import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { IndustriesIntro } from '@/components/industries/IndustriesIntro';
import { IndustryDirectory } from '@/components/industries/IndustryDirectory';
import { DisciplinedApproach } from '@/components/industries/DisciplinedApproach';
import { CrossSectorPerspective } from '@/components/industries/CrossSectorPerspective';
import { WhereInsightMatters } from '@/components/industries/WhereInsightMatters';
import { IndustriesFinalCta } from '@/components/industries/IndustriesFinalCta';
import { Footer } from '@/components/Footer';

export default function IndustriesPage() {
  return (
    <>
      <main>
        <IndustriesHero />
        <IndustriesIntro />
        <IndustryDirectory />
        <DisciplinedApproach />
        <CrossSectorPerspective />
        <WhereInsightMatters />
        <IndustriesFinalCta />
      </main>
      <Footer />
    </>
  );
}
