export interface EnquiryType {
  id: string;
  name: string;
  line: string;
}

export interface ProcessStage {
  name: string;
  description: string;
}

export interface CompanyDetailFact {
  label: string;
  lines: string[];
}

export const contactHero = {
  label: 'Contact',
  headlineLines: ['Let’s start', 'the conversation.'],
  lead: 'Whether you are exploring an opportunity, seeking advisory support or simply want to learn more, we would be pleased to hear from you.',
  primaryCta: { label: 'Discuss Your Goals', href: '#how-can-we-help' },
  secondaryCta: { label: 'Our Approach', href: '/approach' },
  imageStatementLines: ['Ideas.', 'People.', 'Opportunities.', 'Progress.'],
};

export const howCanWeHelp = {
  label: 'Get in Touch',
  headlineLines: ['How can we', 'help you?'],
  supporting: 'Select the type of enquiry so we can better understand how to direct your message.',
  enquiryTypes: [
    { id: 'general', name: 'General Enquiry', line: 'Learn more about DCL.' },
    { id: 'investment', name: 'Investment Advisory', line: 'Discuss an opportunity or investment-related requirement.' },
    { id: 'strategic', name: 'Strategic Advisory', line: 'Explore strategic support.' },
    { id: 'partnerships', name: 'Partnerships', line: 'Business development or partnership enquiries.' },
  ] satisfies EnquiryType[],
  sideStatementLines: ['A more', 'considered', 'tomorrow.'],
  submitLabel: 'Send Message',
  notConnectedNotice: 'Thank you for completing this form. Online message delivery is still being connected, so submissions are not yet delivered. Please check back shortly.',
};

// Verified company details only - do not add fields beyond what has been
// confirmed. The Companies House URL follows that registry's standard,
// deterministic "/company/{number}" profile path for the real company
// number below, not an invented link.
export const companyInformation = {
  label: 'Company Information',
  headlineLines: ['A clear point', 'of contact.'],
  intro:
    'We welcome enquiries from clients, investors, businesses and prospective partners. Whether you are considering an opportunity, exploring advisory support or simply want to learn more about DCL, we would be pleased to hear from you.',
  primaryCta: { label: 'Start a Conversation', href: '#how-can-we-help' },
  secondaryCta: { label: 'View Our Services', href: '/services' },
  statementLines: ['People', 'Perspective', 'Progress'],
  imageAlt: 'Four senior professionals in a strategic discussion around financial data displays in a modern office',
  companyName: 'DCL Consulting and Investments Limited',
  companyTypeLine: 'Private Limited Company',
  registeredInLine: 'Registered in England and Wales',
  facts: [
    { label: 'Company Number', lines: ['10086906'] },
    { label: 'Director', lines: ['David Christopher Lebond'] },
    { label: 'Registered Office', lines: ['3 Tallow Wharf,', 'Birchley Green,', 'Hertford,', 'Hertfordshire,', 'England,', 'SG14 1FF'] },
    { label: 'Jurisdiction', lines: ['England and Wales'] },
    { label: 'Website', lines: ['dcl-consulting-group.com'] },
  ] satisfies CompanyDetailFact[],
  companiesHouseHref: 'https://find-and-update.company-information.service.gov.uk/company/10086906',
  companyRegisterCta: 'View Company Register',
  legalCta: { label: 'Legal Information', href: '/terms' },
};

export const getInTouchBand = {
  label: 'Get in Touch',
  headlineLines: ['Let’s discuss what', 'you’re working on.'],
  body: 'Whether you are evaluating an opportunity, considering a strategic decision or exploring a potential partnership, we would be pleased to hear from you.',
  cta: { label: 'Contact DCL', href: '#how-can-we-help' },
  verifiedDetails: [
    { label: 'Registered Office', lines: ['3 Tallow Wharf,', 'Birchley Green,', 'Hertford,', 'Hertfordshire,', 'England,', 'SG14 1FF', 'United Kingdom'] },
  ] satisfies CompanyDetailFact[],
  locationImage: {
    src: '/images/general/contact-registered-office-location.webp',
    alt: 'Row of traditional red-brick English townhouses with white-painted sash windows along a quiet street',
  },
  locationCaptionLines: ['Hertford, England', 'Registered Office Location'],
  statementLines: ['People', 'Perspective', 'Progress'],
};

export const whatHappensNext = {
  label: 'What Happens Next',
  headlineLines: ['A clear and', 'considered process.'],
  supporting: 'We aim to respond promptly and direct each enquiry to the appropriate person or area of expertise.',
  stages: [
    { name: 'We Receive Your Enquiry', description: 'Your message is securely received and reviewed.' },
    { name: 'We Assess and Route It', description: 'We direct the enquiry to the most relevant area.' },
    { name: 'We Get Back to You', description: 'We respond as soon as practicable regarding the next step.' },
  ] satisfies ProcessStage[],
};

export const contactSupportCta = {
  label: 'Still Have a Question?',
  headline: 'We’re here to help.',
  copy: 'If you are unsure which area your enquiry relates to, simply contact us and we will help guide the conversation.',
  cta: { label: 'Get in Touch', href: '#how-can-we-help' },
};
