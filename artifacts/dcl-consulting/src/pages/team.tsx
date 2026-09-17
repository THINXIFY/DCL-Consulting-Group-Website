import { TeamHero } from '@/components/team/TeamHero';
import { TeamLeadership } from '@/components/team/TeamLeadership';
import { TeamDirectory } from '@/components/team/TeamDirectory';
import { TeamFinalCta } from '@/components/team/TeamFinalCta';
import { Footer } from '@/components/Footer';

export default function TeamPage() {
  return (
    <>
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
