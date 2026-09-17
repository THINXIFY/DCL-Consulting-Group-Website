export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const preFooterCta = {
  label: "Let's Talk",
  headlineLines: ['A clearer perspective', 'starts with a conversation.'],
  supporting: "Speak with DCL about your objectives and explore how independent perspective can support what's next.",
  primaryCta: { label: 'Get in Touch', href: '/contact' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  vocabularyLines: ['People.', 'Insight.', 'Opportunity.'],
  vocabularyEmphasis: 'A brighter tomorrow.',
  imageStatementLines: ['Clarity', 'before', 'capital.'],
};

export const footerBrand = {
  statementLines: ['Independent Perspective', 'for a More Complex World.'],
  copy: 'DCL provides independent advisory perspective across investment, assets, strategy and complex decision-making.',
};

export const footerNavLinks: FooterNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Expertise', href: '/expertise' },
  { label: 'Approach', href: '/approach' },
  { label: 'Industries', href: '/industries' },
  { label: 'Team', href: '/team' },
  { label: 'Insights', href: '/insights' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];

export const footerServicesViewAll: FooterNavLink = { label: 'View All Services', href: '/services' };

export const footerContact = {
  intro: 'Let’s discuss how DCL can support your objectives.',
  cta: { label: 'Get in Touch', href: '/contact' },
};

export const footerLegalLinks: FooterNavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Official Company Profile', href: 'https://find-and-update.company-information.service.gov.uk/company/10086906/officers', external: true },
];

export const footerClosing = 'Clarity Before Capital.';
