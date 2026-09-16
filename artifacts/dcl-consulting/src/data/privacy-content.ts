export interface PolicySection {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
}

export const privacyHero = {
  label: 'Legal',
  headline: 'Privacy Policy',
  intro: 'Your privacy is important to us. This policy explains how personal information is collected, used and protected when you interact with DCL and this website.',
  statementLines: ['Trust', 'Transparency', 'Responsibility'],
  lastUpdated: 'This policy was last updated in 2026.',
};

// This copy is a structured, reasonable DRAFT prepared for DCL's legal
// team to review, amend and formally approve before the page is
// considered final - it should not be treated as approved legal advice
// or a finished legal document. See privacyDraftNotice below, which is
// surfaced prominently on the page itself for the same reason.
export const privacyDraftNotice =
  'This page is a working draft prepared to structure DCL’s privacy information. It has not yet been reviewed or approved by DCL’s legal team and should not be relied upon as final until that review is complete.';

export const privacySections: PolicySection[] = [
  {
    id: 'introduction',
    heading: 'Introduction',
    body: [
      'DCL Consulting and Investments Limited ("DCL", "we", "us" or "our") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard personal information when you visit this website or otherwise interact with us.',
      'By using this website, you agree to the collection and use of information described in this policy. If you do not agree with any part of this policy, please do not continue to use the website.',
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    body: ['We may collect and process the following types of information:'],
    bullets: [
      'Information you provide directly, such as your name, email address and any other details submitted through an enquiry form or other contact with us.',
      'Technical information, including your IP address, browser type and version, device information, and the pages you visit on this website.',
      'Information collected through cookies and similar technologies, as described in the Cookies section below.',
    ],
  },
  {
    id: 'how-we-use-data',
    heading: 'How We Use Your Data',
    body: ['We use personal information for the following purposes:'],
    bullets: [
      'To respond to enquiries and communicate with you.',
      'To provide information about our services where relevant and requested.',
      'To understand and improve how our website is used.',
      'To comply with applicable legal and regulatory obligations.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    body: [
      'This website may use cookies and similar technologies to support core functionality and to understand how the site is used. Cookies are small files stored on your device that help websites remember information about your visit.',
      'You can control or disable cookies through your browser settings. Please note that restricting cookies may affect certain aspects of how this website functions.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your Rights',
    body: ['Depending on your location, you may have certain rights in relation to your personal information, which may include the right to:'],
    bullets: [
      'Request access to the personal information we hold about you.',
      'Request correction of inaccurate or incomplete information.',
      'Request deletion of your personal information in certain circumstances.',
      'Object to or request restriction of certain processing.',
      'Withdraw consent where processing is based on consent.',
      'Lodge a complaint with the relevant data protection authority.',
    ],
  },
  {
    id: 'data-security',
    heading: 'Data Security',
    body: [
      'We take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse or alteration. However, no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'third-parties',
    heading: 'Third Parties',
    body: [
      'We do not sell personal information to third parties. We may share limited information with trusted service providers who support the operation of this website, subject to appropriate confidentiality and data-protection safeguards.',
      'We may also disclose information where required to do so by law or in connection with a legal process.',
    ],
  },
  {
    id: 'international-transfers',
    heading: 'International Transfers',
    body: [
      'Where personal information is transferred outside of your home jurisdiction, we take steps intended to ensure that appropriate safeguards are in place, consistent with applicable data-protection requirements.',
    ],
  },
  {
    id: 'changes-to-this-policy',
    heading: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal or regulatory reasons. Any updates will be reflected on this page, and continued use of the website following a change constitutes acceptance of the updated policy.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: [
      'If you have any questions about this Privacy Policy or how DCL handles personal information, please get in touch with us via our contact page.',
    ],
  },
];

export const privacySupportCta = {
  label: 'Still Have a Question?',
  headline: 'We’re here to help.',
  copy: 'If you have questions about this Privacy Policy or how DCL handles personal information, please contact us.',
  cta: { label: 'Contact Us', href: '/contact' },
};
