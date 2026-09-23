import { dclCompany } from '@/data/company';

/**
 * The single place the DCL phone number is rendered anywhere on the site.
 * Displays the UK-facing number but dials the real operational line - the
 * mismatch is disclosed, never hidden: the aria-label spells it out for
 * screen readers, and the native `title` surfaces it as a hover tooltip
 * on desktop, without a permanent visible caption cluttering the UI.
 */
export function PhoneLink({
  testId = 'link-phone',
  linkClassName,
}: {
  testId?: string;
  linkClassName?: string;
}) {
  return (
    <a
      href={`tel:${dclCompany.phoneDialNumber}`}
      data-testid={testId}
      aria-label={`Call DCL at ${dclCompany.phoneDisplay}. ${dclCompany.phoneRoutingNote}`}
      title={dclCompany.phoneRoutingNote}
      className={linkClassName}
    >
      {dclCompany.phoneDisplay}
    </a>
  );
}
