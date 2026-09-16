import { AssetPortfolioHero } from '@/components/asset-portfolio-advisory/AssetPortfolioHero';
import { AssetOurPerspectiveSection } from '@/components/asset-portfolio-advisory/AssetOurPerspectiveSection';
import { KeyAreasOfAdvisory } from '@/components/asset-portfolio-advisory/KeyAreasOfAdvisory';
import { AnalyticalApproachSection } from '@/components/asset-portfolio-advisory/AnalyticalApproachSection';
import { PortfolioConsiderationsSection } from '@/components/asset-portfolio-advisory/PortfolioConsiderationsSection';
import { AssetWhyDclSection } from '@/components/asset-portfolio-advisory/AssetWhyDclSection';
import { AssetFinalCtaSection } from '@/components/asset-portfolio-advisory/AssetFinalCtaSection';
import { Footer } from '@/components/Footer';

export default function AssetPortfolioAdvisoryPage() {
  return (
    <>
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
