export interface TeamLeader {
  initials: string;
  name: string;
  role: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
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
    {
      initials: 'DL',
      name: 'David Christopher Lebond',
      role: 'Chairman',
      description:
        "Provides overall leadership, strategic direction, and governance, helping align DCL's long-term priorities, commercial judgement, client focus, and organisational development across the business.",
    },
    {
      initials: 'SG',
      name: 'Sandeep Gupta',
      role: 'Managing Director',
      description:
        "Leads day-to-day management and execution, coordinating teams, client priorities, strategic initiatives, and operational delivery while supporting disciplined growth across DCL's advisory activities.",
    },
    {
      initials: 'SR',
      name: 'Stephan Rotstein',
      role: 'CFO',
      description:
        "Oversees financial planning, reporting, controls, and commercial discipline, supporting informed decision-making, responsible resource allocation, and the financial resilience of DCL's operations.",
    },
    {
      initials: 'PG',
      name: 'Patrick Gabaryan',
      role: 'COO',
      description:
        "Directs operational execution across the business, strengthening internal processes, cross-functional coordination, service delivery, and organisational efficiency while supporting DCL's strategic objectives.",
    },
  ] satisfies TeamLeader[],
};

export const teamDirectory = {
  eyebrow: 'Our Team',
  headlineLines: ['A multidisciplinary', 'team for a complex world.'] as [string, string],
  intro: 'Our team combines investment, financial and commercial expertise to deliver clear thinking and practical insight across a wide range of opportunities.',
  members: [
    {
      name: 'Steve Johnson',
      role: 'CRM',
      description:
        'Supports client relationship management by coordinating communication, service continuity, engagement follow-up, and internal collaboration to help maintain responsive, professional, long-term client relationships.',
    },
    {
      name: 'Thomas Zeman',
      role: 'Investment Manager',
      description:
        'Supports the evaluation and management of investment opportunities, combining commercial context, financial considerations, risk awareness, and strategic perspective to inform decision-making.',
    },
    {
      name: 'Markus Weber',
      role: 'Investment Analyst',
      description:
        'Conducts structured investment research and analysis, reviewing market context, financial information, business fundamentals, and material risks to support clear, evidence-based investment assessments.',
    },
    {
      name: 'Brian Alther',
      role: 'Sales Manager',
      description:
        "Leads sales activity and business development, supporting new client relationships, opportunity identification, commercial communication, and coordinated engagement across DCL's advisory offering.",
    },
    {
      name: 'Johnathan Reynolds',
      role: 'Finance Manager',
      description:
        'Supports financial management, budgeting, reporting, and internal controls, helping maintain financial discipline, operational visibility, and reliable information for management decision-making.',
    },
    {
      name: 'Rajesh Sharma',
      role: 'Senior Investment Analyst',
      description:
        'Provides senior-level investment analysis across opportunities and markets, assessing financial fundamentals, commercial drivers, strategic context, and key risks to support informed advisory conclusions.',
    },
    {
      name: 'Sonia Agarwal',
      role: 'Financial Analyst',
      description:
        "Supports financial analysis through detailed review of financial data, performance indicators, assumptions, and commercial context, helping strengthen the quality of DCL's decision support.",
    },
  ] satisfies TeamMember[],
  microLines: ['Talent', 'Discipline', 'Better outcomes'] as [string, string, string],
};

export const teamFinalCta = {
  eyebrow: 'Start a Conversation',
  headlineLines: ['Bring the right perspective', 'to the next decision.'] as [string, string],
  copy: 'Speak with DCL about an investment opportunity, strategic question or potential collaboration.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
