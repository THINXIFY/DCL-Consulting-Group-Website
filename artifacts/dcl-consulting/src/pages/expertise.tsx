import { ExpertiseHero } from '@/components/expertise/ExpertiseHero';
import { HowWeAddPerspective } from '@/components/expertise/HowWeAddPerspective';
import { CoreExpertise } from '@/components/expertise/CoreExpertise';

export default function ExpertisePage() {
  return (
    <main>
      <ExpertiseHero />
      <HowWeAddPerspective />
      <CoreExpertise />
    </main>
  );
}
