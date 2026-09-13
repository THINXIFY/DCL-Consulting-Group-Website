import { ApproachHero } from '@/components/approach/ApproachHero';
import { UnderstandingDecision } from '@/components/approach/UnderstandingDecision';
import { EvaluationProcess } from '@/components/approach/EvaluationProcess';
import { ChallengeAssumptions } from '@/components/approach/ChallengeAssumptions';
import { AnalysisToJudgement } from '@/components/approach/AnalysisToJudgement';
import { WorkingWithDcl } from '@/components/approach/WorkingWithDcl';
import { ApproachFinalCta } from '@/components/approach/ApproachFinalCta';
import { Footer } from '@/components/Footer';

export default function ApproachPage() {
  return (
    <>
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
