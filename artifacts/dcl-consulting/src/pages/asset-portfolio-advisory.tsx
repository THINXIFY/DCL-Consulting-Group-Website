import { AssetPortfolioHero } from '@/components/asset-portfolio-advisory/AssetPortfolioHero';
import { AssetOurPerspectiveSection } from '@/components/asset-portfolio-advisory/AssetOurPerspectiveSection';
import { KeyAreasOfAdvisory } from '@/components/asset-portfolio-advisory/KeyAreasOfAdvisory';
import { AnalyticalApproachSection } from '@/components/asset-portfolio-advisory/AnalyticalApproachSection';
import { PortfolioConsiderationsSection } from '@/components/asset-portfolio-advisory/PortfolioConsiderationsSection';
import { AssetWhyDclSection } from '@/components/asset-portfolio-advisory/AssetWhyDclSection';
import { AssetFinalCtaSection } from '@/components/asset-portfolio-advisory/AssetFinalCtaSection';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Asset & Portfolio Advisory', path: '/services/asset-portfolio-advisory' },
]);

export default function AssetPortfolioAdvisoryPage() {
  return (
    <>
      <Seo
        title="Asset & Portfolio Advisory | DCL Consulting"
        description="DCL Consulting offers asset and portfolio advisory, bringing strategic perspective to asset allocation, portfolio structure and risk considerations."
        path="/services/asset-portfolio-advisory"
        jsonLd={BREADCRUMB}
      />
      <main>
        <AssetPortfolioHero />
        <AssetOurPerspectiveSection />
        <KeyAreasOfAdvisory />
        <AnalyticalApproachSection />
        <PortfolioConsiderationsSection />
        <AssetWhyDclSection />
        <AssetFinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
