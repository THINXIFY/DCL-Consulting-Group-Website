import { ExpertiseHero } from '@/components/expertise/ExpertiseHero';
import { HowWeAddPerspective } from '@/components/expertise/HowWeAddPerspective';
import { CoreExpertise } from '@/components/expertise/CoreExpertise';
import { WhereExpertiseApplies } from '@/components/expertise/WhereExpertiseApplies';
import { ExpertiseFinalCta } from '@/components/expertise/ExpertiseFinalCta';

export default function ExpertisePage() {
  return (
    <main>
      <ExpertiseHero />
      <HowWeAddPerspective />
      <CoreExpertise />
      <WhereExpertiseApplies />
      <ExpertiseFinalCta />
    </main>
  );
}
