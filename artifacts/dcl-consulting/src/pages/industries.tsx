import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { IndustriesIntro } from '@/components/industries/IndustriesIntro';
import { IndustryDirectory } from '@/components/industries/IndustryDirectory';
import { DisciplinedApproach } from '@/components/industries/DisciplinedApproach';
import { CrossSectorPerspective } from '@/components/industries/CrossSectorPerspective';
import { WhereInsightMatters } from '@/components/industries/WhereInsightMatters';
import { IndustriesFinalCta } from '@/components/industries/IndustriesFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Industries', path: '/industries' },
]);

export default function IndustriesPage() {
  return (
    <>
      <Seo
        title="Industries We Advise Across | DCL Consulting"
        description="DCL Consulting provides independent investment and strategic advisory across a range of industries, sectors and asset classes for investors and businesses."
        path="/industries"
        jsonLd={BREADCRUMB}
      />
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
