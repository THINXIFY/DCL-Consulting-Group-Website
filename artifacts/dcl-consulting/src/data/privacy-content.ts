export interface PolicyFact {
  label: string;
  value: string;
}

export interface PolicyLink {
  label: string;
  href: string;
}

export interface PolicySection {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
  facts?: PolicyFact[];
  links?: PolicyLink[];
}

export const privacyHero = {
  label: 'Legal',
  headline: 'Privacy Policy',
  intro:
    'This Privacy Policy explains how we collect, use, store and protect personal information when you visit dcl-consulting-group.com, contact us, or use features available through our website.',
  statementLines: ['Trust', 'Transparency', 'Responsibility'],
  lastUpdated: 'Last updated: 17 September 2026',
};

export const privacySections: PolicySection[] = [
  {
    id: 'introduction',
    heading: 'Introduction',
    body: [
      'DCL Consulting and Investments Limited ("DCL", "we", "us" or "our") respects your privacy and is committed to handling personal information responsibly and transparently.',
      'This Privacy Policy explains how we collect, use, store and protect personal information when you visit dcl-consulting-group.com, contact us, or use features available through our website.',
      'DCL Consulting and Investments Limited is a private limited company registered in England and Wales under company number 10086906.',
    ],
  },
  {
    id: 'who-we-are',
    heading: 'Who We Are',
    body: ['DCL Consulting and Investments Limited provides investment consulting, strategic advisory and related decision-support services.'],
    facts: [
      { label: 'Registered office', value: '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF' },
      { label: 'Company number', value: '10086906' },
      { label: 'Website', value: 'dcl-consulting-group.com' },
      { label: 'Privacy enquiries', value: 'info@dcl-consulting-group.com' },
    ],
  },
  {
    id: 'information-we-may-collect',
    heading: 'Information We May Collect',
    body: [
      'Depending on how you interact with the website, we may collect the following types of personal information.',
      'Contact information. This may include your name, email address and any other information you choose to provide when contacting us.',
      'Enquiry information. If you submit an enquiry, we may receive information relating to your organisation, project, opportunity, requirements or other matters included in your message.',
      'Secure document request information. When you use the "Request More Info" feature, we process your email address in order to send a verification code and, following successful verification, deliver the requested documents.',
      'Technical information. Our systems may process limited technical information required for security, reliability and operation of the website. This may include IP address, browser information, request timestamps, server logs and related security information.',
      'Information you provide voluntarily. You may choose to provide additional information when corresponding with DCL. Please avoid sending sensitive personal information unless it is necessary and appropriate for the purpose of your enquiry.',
    ],
  },
  {
    id: 'how-we-collect-information',
    heading: 'How We Collect Information',
    body: ['We may collect information:'],
    bullets: [
      'when you contact DCL through the website',
      'when you correspond with us by email',
      'when you request information or documents',
      'when you complete email verification',
      'automatically through normal website and server operation',
      'through security and rate-limiting mechanisms used to protect our systems',
    ],
  },
  {
    id: 'how-we-use-personal-information',
    heading: 'How We Use Personal Information',
    body: ['We may use personal information to:'],
    bullets: [
      'respond to enquiries and communications',
      'understand the nature of a request or potential engagement',
      'provide requested information',
      'securely deliver requested documents',
      'verify an email address when required',
      'administer and operate the website',
      'protect the website and our systems against misuse, fraud or security threats',
      'investigate technical issues',
      'maintain appropriate business and compliance records',
      'comply with applicable legal obligations',
      'establish, exercise or defend legal rights where necessary',
    ],
  },
  {
    id: 'request-more-info-and-email-verification',
    heading: 'Request More Info and Email Verification',
    body: [
      'The DCL website includes a secure document-request feature. When you request information: you provide an email address; a six-digit verification code is sent to that address; the verification code is used to confirm access to the email address; and, following successful verification, the requested documents are sent to that verified email address.',
      'Verification codes are temporary and are used only for security and document delivery.',
      'DCL applies technical safeguards including expiry periods, verification-attempt limits and request-rate controls.',
      'The submitted email address is not automatically enrolled into a newsletter or marketing list through this process. We do not use the email address submitted through the Request More Info feature for marketing simply because a user requested documents.',
    ],
  },
  {
    id: 'email-delivery-providers',
    heading: 'Email Delivery Providers',
    body: [
      'DCL may use third-party email-delivery infrastructure to send verification codes, requested documents and operational communications.',
      'Our current website infrastructure may use Resend or another authorised email service provider to process outgoing email on our behalf.',
      'Such providers process information only as required to deliver the relevant communication and subject to their own security and data-protection obligations.',
    ],
  },
  {
    id: 'legal-basis-for-processing',
    heading: 'Legal Basis for Processing',
    body: [
      'Where UK data-protection law applies, we process personal information only where we have an appropriate legal basis. Depending on the circumstances, this may include:',
      'Legitimate interests. We may process information where reasonably necessary to operate our business, respond to enquiries, protect our systems, communicate with prospective clients or partners, and provide requested information.',
      'Steps prior to entering into a contract. Where you contact us about a potential engagement, we may process information necessary to consider your request and take steps at your request before entering into a contract.',
      'Contractual necessity. Where an engagement exists, we may process information as necessary to perform our contractual obligations.',
      'Legal obligations. We may process information where necessary to comply with applicable law, regulation, legal process or lawful requests.',
      'Consent. Where processing relies on consent, you may withdraw that consent where applicable.',
    ],
  },
  {
    id: 'cookies-and-similar-technologies',
    heading: 'Cookies and Similar Technologies',
    body: [
      'The website does not currently use analytics, advertising or non-essential tracking cookies.',
      'Any technologies used are limited to those strictly necessary for the website to function, such as basic mechanisms required for security and reliability.',
      'If this changes in the future, for example if analytics or marketing technologies are introduced, this section will be updated accordingly and, where required by applicable law, appropriate consent will be obtained before non-essential cookies or similar technologies are used.',
    ],
  },
  {
    id: 'sharing-personal-information',
    heading: 'Sharing Personal Information',
    body: [
      'We do not sell personal information.',
      'We may share limited personal information with trusted service providers where reasonably necessary to operate the website or provide requested services. This may include providers supporting:',
    ],
    bullets: ['website hosting', 'infrastructure', 'email delivery', 'cybersecurity', 'professional services', 'technical maintenance'],
  },
  {
    id: 'international-data-transfers',
    heading: 'International Data Transfers',
    body: [
      'Some technology or service providers used by DCL may process information from locations outside the United Kingdom.',
      'Where applicable, DCL seeks to use appropriate safeguards for international transfers of personal information in accordance with applicable data-protection requirements.',
      'The exact location and safeguards may depend on the service provider involved.',
    ],
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    body: [
      'We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, including legal, operational, security and record-keeping requirements.',
      'Secure document verification challenges are temporary and are designed to expire after a short period.',
      'Operational and security logs may be retained for a reasonable period where necessary for system integrity, troubleshooting or security.',
      'Business correspondence and engagement-related information may be retained for longer where appropriate for legitimate business, contractual or legal purposes.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    body: [
      'DCL uses reasonable technical and organisational measures intended to protect personal information from unauthorised access, loss, misuse, alteration or disclosure. These measures may include:',
    ],
    bullets: [
      'encrypted HTTPS connections',
      'restricted server access',
      'access controls',
      'secure environment-variable management',
      'verification-code expiry',
      'request-rate limiting',
      'verification-attempt limits',
      'server-side document access controls',
    ],
  },
  {
    id: 'your-data-protection-rights',
    heading: 'Your Data-Protection Rights',
    body: [
      'Depending on the circumstances and applicable law, you may have rights in relation to your personal information, including the right to:',
    ],
    bullets: [
      'request access to personal information we hold about you',
      'request correction of inaccurate information',
      'request deletion of information in certain circumstances',
      'request restriction of processing',
      'object to certain processing',
      'request transfer of information where applicable',
      'withdraw consent where processing is based on consent',
      'raise a concern with the relevant supervisory authority',
    ],
  },
  {
    id: 'childrens-privacy',
    heading: "Children's Privacy",
    body: [
      'The DCL website and services are intended for business and professional audiences and are not directed toward children.',
      'We do not knowingly seek to collect personal information from children through this website.',
    ],
  },
  {
    id: 'third-party-websites',
    heading: 'Third-Party Websites',
    body: [
      'The website may contain links to websites operated by third parties.',
      'DCL is not responsible for the privacy practices, security or content of third-party websites.',
      'We encourage users to review the relevant privacy information when visiting another website.',
    ],
  },
  {
    id: 'changes-to-this-privacy-policy',
    heading: 'Changes to This Privacy Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our website, services, technology, business practices or applicable requirements.',
      'The latest version will be published on this page together with the date it was last updated.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    body: [
      'If you have questions about this Privacy Policy or how DCL handles personal information, please contact:',
      'DCL Consulting and Investments Limited',
      '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF',
      'Email: info@dcl-consulting-group.com',
      'Company number: 10086906',
    ],
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Contact DCL', href: '/contact' },
    ],
  },
];

export const privacySupportCta = {
  label: 'Questions?',
  headline: "We're here to help.",
  copy: 'If you have a question about this policy, these terms or your use of the DCL website, please contact us.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
