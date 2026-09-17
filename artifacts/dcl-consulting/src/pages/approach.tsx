import { ApproachHero } from '@/components/approach/ApproachHero';
import { UnderstandingDecision } from '@/components/approach/UnderstandingDecision';
import { EvaluationProcess } from '@/components/approach/EvaluationProcess';
import { ChallengeAssumptions } from '@/components/approach/ChallengeAssumptions';
import { AnalysisToJudgement } from '@/components/approach/AnalysisToJudgement';
import { WorkingWithDcl } from '@/components/approach/WorkingWithDcl';
import { ApproachFinalCta } from '@/components/approach/ApproachFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Approach', path: '/approach' },
]);

export default function ApproachPage() {
  return (
    <>
      <Seo
        title="Our Investment Advisory Approach | DCL Consulting"
        description="See how DCL Consulting approaches investment advisory: understanding objectives, analysing options and delivering independent, decision-ready perspective."
        path="/approach"
        jsonLd={BREADCRUMB}
      />
      <main>
        <ApproachHero />
        <UnderstandingDecision />
        <EvaluationProcess />
        <ChallengeAssumptions />
        <AnalysisToJudgement />
        <WorkingWithDcl />
        <ApproachFinalCta />
      </main>
      <Footer />
    </>
  );
}
