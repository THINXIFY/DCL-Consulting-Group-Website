export interface TeamLeader {
  initials: string;
  name: string;
  role: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export const teamHero = {
  eyebrow: 'Our Team',
  headlineLines: ['Perspective shaped', 'by people.'] as [string, string],
  intro:
    'DCL brings together leadership, investment, financial and commercial perspectives to support considered decision-making across opportunities and markets.',
  statementLines: ['People', 'Perspective', 'Progress'] as [string, string, string],
  backgroundImage: 'https://marbholding.com/wp-content/uploads/2026/09/team-hero.webp',
};

export const teamLeadership = {
  eyebrow: 'Leadership',
  headlineLines: ['Experience that', 'shapes opportunity.'] as [string, string],
  intro:
    'Our leadership brings diverse perspectives and deep expertise to guide our clients through complex challenges and long-term opportunities.',
  members: [
    { initials: 'DL', name: 'David Christopher Lebond', role: 'Chairman' },
    { initials: 'SG', name: 'Sandeep Gupta', role: 'Managing Director' },
    { initials: 'SR', name: 'Stephan Rotstein', role: 'CFO' },
    { initials: 'PG', name: 'Patrick Gabaryan', role: 'COO' },
  ] satisfies TeamLeader[],
};

export const teamDirectory = {
  eyebrow: 'Our Team',
  headlineLines: ['A multidisciplinary', 'team for a complex world.'] as [string, string],
  intro: 'Our team combines investment, financial and commercial expertise to deliver clear thinking and practical insight across a wide range of opportunities.',
  members: [
    { name: 'Steve Johnson', role: 'CRM' },
    { name: 'Thomas Zeman', role: 'Investment Manager' },
    { name: 'Markus Weber', role: 'Investment Analyst' },
    { name: 'Brian Alther', role: 'Sales Manager' },
    { name: 'Johnathan Reynolds', role: 'Finance Manager' },
    { name: 'Rajesh Sharma', role: 'Senior Investment Analyst' },
    { name: 'Sonia Agarwal', role: 'Financial Analyst' },
  ] satisfies TeamMember[],
  microLines: ['Talent', 'Discipline', 'Better outcomes'] as [string, string, string],
};

export const teamFinalCta = {
  eyebrow: 'Start a Conversation',
  headlineLines: ['Bring the right perspective', 'to the next decision.'] as [string, string],
  copy: 'Speak with DCL about an investment opportunity, strategic question or potential collaboration.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
