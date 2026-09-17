export interface TermsFact {
  label: string;
  value: string;
}

export interface TermsLink {
  label: string;
  href: string;
}

export interface TermsSection {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
  facts?: TermsFact[];
  links?: TermsLink[];
}

export const termsHero = {
  label: 'Legal',
  headline: 'Terms & Conditions',
  lead: 'These Terms & Conditions govern access to and use of the website operated by DCL Consulting and Investments Limited.',
  supporting:
    'Please read these terms carefully before using the website. By accessing or using dcl-consulting-group.com, you agree to use the website in accordance with these Terms & Conditions.',
  statementLines: ['Clarity', 'Responsibility', 'Trust'],
  lastUpdated: 'Last updated: 17 September 2026',
};

export const termsSections: TermsSection[] = [
  {
    id: 'about-dcl',
    heading: 'About DCL',
    body: ['This website is operated by DCL Consulting and Investments Limited, a private limited company registered in England and Wales.'],
    facts: [
      { label: 'Company name', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company number', value: '10086906' },
      { label: 'Registered office', value: '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF' },
      { label: 'Website', value: 'dcl-consulting-group.com' },
      { label: 'Contact', value: 'info@dcl-consulting-group.com' },
    ],
  },
  {
    id: 'purpose-of-this-website',
    heading: 'Purpose of This Website',
    body: [
      'The website provides general information about DCL, our areas of expertise, advisory capabilities, industries, perspectives and related services.',
      'Website content is provided for general informational and corporate purposes only.',
      'Information available through this website should not be treated as advice tailored to your individual circumstances.',
    ],
  },
  {
    id: 'no-investment-financial-legal-or-tax-advice',
    heading: 'No Investment, Financial, Legal or Tax Advice',
    body: [
      'Nothing on this website constitutes or should be interpreted as personalised investment advice, financial advice, legal advice, tax advice or regulatory advice.',
      'Any decision involving investments, businesses, assets, transactions or strategic matters should be considered in light of the relevant circumstances and, where appropriate, with advice from suitably qualified independent professionals.',
    ],
  },
  {
    id: 'no-offer-or-solicitation',
    heading: 'No Offer or Solicitation',
    body: [
      'Nothing on this website constitutes an offer, solicitation, invitation or recommendation to buy or sell any investment, acquire or dispose of any security, enter into any financial transaction, make any investment commitment, or participate in any particular opportunity.',
      'Any actual engagement with DCL will be subject to separately agreed terms.',
    ],
  },
  {
    id: 'our-services',
    heading: 'Our Services',
    body: [
      'Descriptions of DCL services are intended to provide a general overview of our capabilities.',
      'The precise scope, responsibilities, deliverables, fees and terms applicable to any engagement will be agreed separately with the relevant client.',
      'Use of this website alone does not:',
    ],
    bullets: [
      'create a client relationship',
      'create an advisory relationship',
      'create a fiduciary relationship',
      'oblige DCL to accept an engagement',
      'create contractual obligations between DCL and a website visitor',
    ],
  },
  {
    id: 'reliance-on-website-information',
    heading: 'Reliance on Website Information',
    body: [
      'DCL seeks to present useful and accurate information, but circumstances, markets, businesses and legal or commercial conditions may change.',
      'Website material may not always reflect the most recent information available.',
      'You should not make a material investment, commercial or strategic decision solely on the basis of general website content.',
      'Formal advice provided by DCL, where applicable, will be subject to the scope and terms of the relevant engagement.',
    ],
  },
  {
    id: 'use-of-the-website',
    heading: 'Use of the Website',
    body: [
      'You may use this website for lawful personal, professional and business-information purposes.',
      'You must not use the website in any way that:',
    ],
    bullets: [
      'breaches applicable law or regulation',
      'damages or interferes with website operation',
      'attempts to gain unauthorised access to systems or information',
      'introduces viruses, malicious code or harmful technology',
      'circumvents security controls',
      'abuses verification, document-request or communication features',
      'impersonates DCL or another person',
      'misrepresents an association with DCL',
      'unlawfully copies, reproduces or distributes website material',
    ],
  },
  {
    id: 'request-more-info-feature',
    heading: 'Request More Info Feature',
    body: [
      'The website may allow users to request documents or further information.',
      'Where email verification is required, users must provide access to a valid email address and successfully complete the verification process.',
      'Users must not attempt to misuse, automate, circumvent or interfere with the verification process.',
      'Successful verification does not create a client or contractual relationship with DCL.',
      'Verification codes:',
    ],
    bullets: ['are temporary', 'are intended only for the recipient', 'may expire', 'may be subject to request and attempt limits'],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    body: [
      'Unless otherwise stated, the website and its content are owned by, licensed to or used with permission by DCL Consulting and Investments Limited. This may include:',
    ],
    bullets: ['text', 'branding', 'logos', 'design', 'graphics', 'photographs', 'video', 'documents', 'page layouts', 'software elements', 'other website materials'],
  },
  {
    id: 'documents-provided-through-the-website',
    heading: 'Documents Provided Through the Website',
    body: [
      'Documents supplied through the website are provided for the purpose stated when they are delivered.',
      'Recipients are responsible for considering information in light of their own circumstances.',
      'Unless expressly stated otherwise, providing a document does not constitute:',
    ],
    bullets: ['personalised advice', 'a recommendation', 'an offer', 'a commitment by DCL', 'confirmation that any opportunity is suitable for a particular recipient'],
  },
  {
    id: 'third-party-links',
    heading: 'Third-Party Links',
    body: [
      'The website may contain links to websites or resources operated by third parties.',
      'Such links are provided for convenience or additional information.',
      'The inclusion of a link does not necessarily constitute endorsement.',
      'DCL does not control third-party websites and is not responsible for their:',
    ],
    bullets: ['content', 'security', 'availability', 'privacy practices', 'accuracy', 'services'],
  },
  {
    id: 'website-availability',
    heading: 'Website Availability',
    body: [
      'We aim to keep the website available and functioning appropriately, but we do not guarantee uninterrupted or error-free access.',
      'DCL may modify, suspend or remove website content or functionality where reasonably necessary.',
      'The website may occasionally be unavailable due to:',
    ],
    bullets: ['maintenance', 'updates', 'technical problems', 'hosting issues', 'security events', 'circumstances outside our reasonable control'],
  },
  {
    id: 'warranties',
    heading: 'Warranties',
    body: [
      'To the extent permitted by applicable law, the website and its general informational content are provided without any guarantee that all content will always be complete, current, error-free or suitable for a particular purpose.',
      'Nothing in these Terms excludes any right or protection that cannot legally be excluded.',
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    body: [
      'To the extent permitted by applicable law, DCL will not be responsible for losses arising solely from reliance on general website information where no formal advisory engagement exists.',
      'Nothing in these Terms excludes or limits liability where doing so would be unlawful, and any liability arising under a formal client engagement will be governed by the terms of that engagement.',
      'DCL will not be responsible for loss arising from:',
    ],
    bullets: [
      'misuse of the website',
      "unauthorised access caused by circumstances outside DCL's reasonable control",
      'third-party websites',
      'interruptions beyond our reasonable control',
      'decisions made solely on the basis of general website content',
    ],
  },
  {
    id: 'privacy',
    heading: 'Privacy',
    body: [
      'Personal information collected through the website is handled in accordance with our Privacy Policy.',
      'Users of the Request More Info feature should also review the Privacy Policy for information about email verification and document delivery.',
    ],
    links: [{ label: 'Privacy Policy', href: '/privacy-policy' }],
  },
  {
    id: 'security',
    heading: 'Security',
    body: ['We may take appropriate technical or legal action in response to misuse.', 'You must not attempt to:'],
    bullets: [
      'probe or test website security without authorisation',
      'interfere with servers or networks',
      'access restricted resources',
      'bypass verification systems',
      'automate abusive requests',
      'obtain protected documents without completing required access controls',
    ],
  },
  {
    id: 'changes-to-the-website',
    heading: 'Changes to the Website',
    body: [
      'DCL may update, change, add or remove website content, functionality or services without prior notice.',
      "Information describing DCL's services or capabilities may change as our business develops.",
    ],
  },
  {
    id: 'changes-to-these-terms',
    heading: 'Changes to These Terms',
    body: [
      'We may update these Terms & Conditions from time to time.',
      'The latest version will be published on this page and will show the date of the most recent update.',
      'Continued use of the website following an update will be subject to the current version of these Terms.',
    ],
  },
  {
    id: 'severability',
    heading: 'Severability',
    body: ['If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law.'],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    body: [
      'These Terms & Conditions and any non-contractual matters arising from use of this website are governed by the laws of England and Wales, subject to any mandatory rights that may apply under applicable law.',
      'The courts of England and Wales will have jurisdiction in relation to disputes concerning these Terms, except where applicable law provides otherwise.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: [
      'Questions regarding these Terms & Conditions may be sent to:',
      'DCL Consulting and Investments Limited',
      '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF',
      'Email: info@dcl-consulting-group.com',
      'Company number: 10086906',
    ],
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Contact DCL', href: '/contact' },
    ],
  },
];

export const termsSupportCta = {
  eyebrow: 'Questions?',
  headline: "We're here to help.",
  copy: 'If you have a question about this policy, these terms or your use of the DCL website, please contact us.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
