import { InsightsHero } from '@/components/insights/InsightsHero';
import { FeaturedInsight } from '@/components/insights/FeaturedInsight';
import { LatestPerspectives } from '@/components/insights/LatestPerspectives';
import { InsightThemes } from '@/components/insights/InsightThemes';
import { DclViewpoint } from '@/components/insights/DclViewpoint';
import { InsightsArchive } from '@/components/insights/InsightsArchive';
import { InsightsFinalCta } from '@/components/insights/InsightsFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Insights', path: '/insights' },
]);

export default function InsightsPage() {
  return (
    <>
      <Seo
        title="Investment Insights & Perspectives | DCL Consulting"
        description="Read independent perspective from DCL Consulting on investment, strategy, markets, risk and the forces shaping long-term opportunity for investors."
        path="/insights"
        jsonLd={BREADCRUMB}
      />
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
