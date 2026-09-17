import { ExpertiseHero } from '@/components/expertise/ExpertiseHero';
import { HowWeAddPerspective } from '@/components/expertise/HowWeAddPerspective';
import { CoreExpertise } from '@/components/expertise/CoreExpertise';
import { WhereExpertiseApplies } from '@/components/expertise/WhereExpertiseApplies';
import { WhyDclExpertise } from '@/components/expertise/WhyDclExpertise';
import { ExpertiseFinalCta } from '@/components/expertise/ExpertiseFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Expertise', path: '/expertise' },
]);

export default function ExpertisePage() {
  return (
    <>
      <Seo
        title="Investment Expertise & Strategic Analysis | DCL Consulting"
        description="Discover DCL Consulting's expertise in investment analysis, strategic decision support and independent advisory across complex opportunities."
        path="/expertise"
        jsonLd={BREADCRUMB}
      />
      <main>
        <ExpertiseHero />
        <HowWeAddPerspective />
        <CoreExpertise />
        <WhereExpertiseApplies />
        <WhyDclExpertise />
        <ExpertiseFinalCta />
      </main>
      <Footer />
    </>
  );
}
