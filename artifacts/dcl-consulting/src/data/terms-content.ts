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
  lead: 'These Terms & Conditions explain the basis on which you may access and use the DCL website and its content.',
  supporting: 'Please read these terms carefully. By accessing or using this website, you acknowledge the terms applicable to your use of the site and its materials.',
  statementLines: ['Clarity', 'Responsibility', 'Trust'],
  lastUpdated: 'This page was last updated in 2026.',
};

// This copy is a structured, reasonable DRAFT prepared for DCL's legal
// team to review, amend and formally approve before the page is
// considered final - it should not be treated as approved legal advice
// or a finished legal document. No pre-existing Terms & Conditions
// content was found elsewhere in the project, so this mirrors the same
// working-draft approach already applied to the Privacy Policy page.
export const termsDraftNotice =
  'This page is a working draft prepared to structure DCL’s Terms & Conditions. It has not yet been reviewed or approved by DCL’s legal team and should not be relied upon as final until that review is complete.';

export const termsSections: TermsSection[] = [
  {
    id: 'about-dcl',
    heading: 'About DCL',
    body: ['This website is operated by DCL Consulting and Investments Limited, a private limited company registered in England and Wales.'],
    facts: [
      { label: 'Company name', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company number', value: '10086906' },
      { label: 'Jurisdiction', value: 'England and Wales' },
    ],
  },
  {
    id: 'introduction',
    heading: 'Introduction',
    body: [
      'These Terms & Conditions apply to your access to and use of the DCL website.',
      'By using this website, you agree to use it responsibly, lawfully and in accordance with these terms.',
      'If you do not agree with these terms, you should discontinue use of the website.',
    ],
  },
  {
    id: 'information-provided',
    heading: 'Information provided on this website',
    body: [
      'The information presented on this website is provided for general informational and corporate purposes.',
      'Content may describe DCL’s advisory capabilities, areas of expertise, perspectives and services, but it should not be interpreted as personalised investment, financial, legal, tax or regulatory advice.',
      'Nothing on this website constitutes an offer, solicitation, recommendation or commitment to enter into any investment or transaction.',
      'Visitors should obtain appropriate independent professional advice before making decisions based on information relevant to their particular circumstances.',
    ],
  },
  {
    id: 'our-services',
    heading: 'Our services',
    body: [
      'Descriptions of DCL’s services are intended to provide a general overview of our advisory capabilities.',
      'The nature, scope and terms of any engagement will be agreed separately between DCL and the relevant client.',
      'Information on this website does not create a client relationship, contractual obligation or advisory engagement.',
    ],
  },
  {
    id: 'use-of-website',
    heading: 'Use of the website',
    body: ['You may use this website for legitimate informational and business purposes.', 'You must not use the website in a way that:'],
    bullets: [
      'breaches applicable law or regulation',
      'interferes with the operation or security of the website',
      'attempts to gain unauthorised access to systems, data or restricted areas',
      'introduces malicious software or harmful code',
      'misuses, copies or distributes website content contrary to applicable intellectual-property rights',
      'impersonates DCL or misrepresents an association with DCL',
    ],
  },
  {
    id: 'accuracy-availability',
    heading: 'Accuracy and availability',
    body: [
      'DCL seeks to maintain clear and useful website information. However, website content may change over time and may not always reflect the most recent developments.',
      'DCL may update, modify, suspend or remove website content without prior notice.',
      'The availability of the website is not guaranteed, and access may occasionally be interrupted for technical, operational or maintenance reasons.',
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    body: [
      'Unless otherwise stated, the content, branding, design, text, graphics and other materials presented on this website are owned by or used with the permission of DCL Consulting and Investments Limited.',
      'Website content may be viewed and used for legitimate personal or business-information purposes.',
      'Content must not be reproduced, distributed, republished or commercially exploited without appropriate permission where permission is required.',
    ],
  },
  {
    id: 'third-party-websites',
    heading: 'Third-party websites',
    body: [
      'This website may contain links to third-party websites or external resources for convenience or additional information.',
      'DCL does not control third-party websites and is not responsible for their content, availability, security, privacy practices or accuracy.',
      'A link to an external website does not necessarily constitute endorsement of that website, organisation or its services.',
    ],
  },
  {
    id: 'reliance-on-content',
    heading: 'Reliance on website content',
    body: [
      'Decisions involving investments, transactions, businesses, assets or strategic matters can depend on a wide range of circumstances.',
      'Website content should therefore not be relied upon as a substitute for appropriate professional analysis or advice specific to a particular situation.',
      'DCL’s formal advice, where provided, will be subject to the terms of the relevant engagement.',
    ],
  },
  {
    id: 'privacy-cookies',
    heading: 'Privacy and cookies',
    body: ['Your use of this website may involve the processing of personal information and the use of cookies or similar technologies.', 'Please refer to our Privacy Policy for further information.'],
    links: [{ label: 'Privacy Policy', href: '/privacy-policy' }],
  },
  {
    id: 'changes-to-terms',
    heading: 'Changes to these terms',
    body: [
      'DCL may update these Terms & Conditions from time to time to reflect changes to the website, our practices or applicable requirements.',
      'Visitors are encouraged to review this page periodically.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: ['If you have a question regarding these Terms & Conditions or the use of this website, please contact DCL through our Contact page.'],
    links: [{ label: 'Contact DCL', href: '/contact' }],
  },
];

export const termsSupportCta = {
  eyebrow: 'Questions about these terms?',
  headline: 'We’re here to help.',
  copy: 'If you have a question about these Terms & Conditions or how they apply to your use of the DCL website, please contact us.',
  cta: { label: 'Contact Us', href: '/contact' },
};
