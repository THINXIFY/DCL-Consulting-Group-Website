import { InsightsHero } from '@/components/insights/InsightsHero';
import { FeaturedInsight } from '@/components/insights/FeaturedInsight';
import { LatestPerspectives } from '@/components/insights/LatestPerspectives';
import { InsightThemes } from '@/components/insights/InsightThemes';
import { DclViewpoint } from '@/components/insights/DclViewpoint';
import { InsightsArchive } from '@/components/insights/InsightsArchive';
import { InsightsFinalCta } from '@/components/insights/InsightsFinalCta';
import { Footer } from '@/components/Footer';

export default function InsightsPage() {
  return (
    <>
      <main>
        <InsightsHero />
        <FeaturedInsight />
        <LatestPerspectives />
        <InsightThemes />
        <DclViewpoint />
        <InsightsArchive />
        <InsightsFinalCta />
      </main>
      <Footer />
    </>
  );
}
