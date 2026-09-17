import { TeamHero } from '@/components/team/TeamHero';
import { TeamLeadership } from '@/components/team/TeamLeadership';
import { TeamDirectory } from '@/components/team/TeamDirectory';
import { TeamFinalCta } from '@/components/team/TeamFinalCta';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

const BREADCRUMB = buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Team', path: '/team' },
]);

export default function TeamPage() {
  return (
    <>
      <Seo
        title="Our Team | DCL Consulting and Investments Limited"
        description="Meet the DCL Consulting and Investments Limited team providing independent investment consulting, strategic advisory and decision support."
        path="/team"
        jsonLd={BREADCRUMB}
      />
      <main>
        <TeamHero />
        <TeamLeadership />
        <TeamDirectory />
        <TeamFinalCta />
      </main>
      <Footer />
    </>
  );
}
