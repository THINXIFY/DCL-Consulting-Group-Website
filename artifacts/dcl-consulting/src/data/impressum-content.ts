import { dclCompany } from './company';

export interface ImpressumFact {
  label: string;
  value: string;
}

export interface ImpressumLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ImpressumAddress {
  heading: string;
  lines: string[];
}

export interface ImpressumSection {
  id: string;
  heading: string;
  body: string[];
  facts?: ImpressumFact[];
  addresses?: ImpressumAddress[];
  links?: ImpressumLink[];
}

export const impressumHero = {
  label: 'Legal Information',
  headline: 'Impressum',
  intro: 'Corporate and legal information for DCL Consulting and Investments Limited.',
  lastUpdated: 'Last updated: 17 September 2026',
  backgroundImage: 'https://marbholding.com/wp-content/uploads/2026/09/impressum-hero.webp',
  statementLines: ['Clarity', 'Information', 'Trust'],
};

export const impressumSections: ImpressumSection[] = [
  {
    id: 'company-information',
    heading: 'Company Information',
    body: [dclCompany.name],
    facts: [
      { label: 'Company type', value: dclCompany.type },
      { label: 'Company registration number', value: dclCompany.number },
      { label: 'Registered in', value: dclCompany.jurisdiction },
      { label: 'Email', value: dclCompany.email },
      { label: 'Website', value: dclCompany.website },
    ],
  },
  {
    id: 'our-offices',
    heading: 'Our Offices',
    body: [],
    addresses: [
      { heading: 'Registered Office', lines: dclCompany.registeredOfficeLines },
      { heading: 'London Office', lines: dclCompany.londonOfficeLines },
    ],
  },
  {
    id: 'company-register',
    heading: 'Company Register',
    body: [`${dclCompany.name} is a company incorporated in England and Wales and registered with Companies House.`],
    facts: [{ label: 'Company registration number', value: dclCompany.number }],
    links: [{ label: 'View Official Company Profile', href: dclCompany.companiesHouseUrl, external: true }],
  },
  {
    id: 'legal-information',
    heading: 'Legal Information',
    body: [
      `${dclCompany.name} is a company incorporated in England and Wales and registered with Companies House.`,
      'The information provided on this website is for general informational purposes only and does not constitute investment, financial, legal, tax or other professional advice unless expressly stated otherwise.',
      'Nothing on this website should be interpreted as an offer, solicitation, recommendation or invitation to enter into any investment or transaction.',
    ],
  },
  {
    id: 'responsible-for-website-content',
    heading: 'Responsible for Website Content',
    body: [dclCompany.name, 'David Christopher Lebond', ...dclCompany.registeredOfficeLines],
  },
  {
    id: 'regulatory-information',
    heading: 'Regulatory Information',
    body: [
      'Where applicable, details regarding regulatory permissions, authorisations or registrations will be stated expressly.',
      `Nothing on this website should be interpreted as indicating that ${dclCompany.name} is authorised to provide regulated financial services unless such authorisation has been specifically confirmed and stated.`,
    ],
  },
  {
    id: 'copyright',
    heading: 'Copyright',
    body: [`© 2026 ${dclCompany.name}. All rights reserved.`],
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Contact DCL', href: '/contact' },
    ],
  },
];

export const impressumSupportCta = {
  label: 'Questions?',
  headline: "We're here to help.",
  copy: 'If you have a question about this policy, these terms or your use of the DCL website, please contact us.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
