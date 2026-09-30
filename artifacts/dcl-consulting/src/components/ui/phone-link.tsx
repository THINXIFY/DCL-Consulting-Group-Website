import { dclCompany } from '@/data/company';

/** The single place the DCL phone number is rendered anywhere on the site. */
export function PhoneLink({
  testId = 'link-phone',
  linkClassName,
}: {
  testId?: string;
  linkClassName?: string;
}) {
  return (
    <a
      href={`tel:${dclCompany.phoneDisplay.replace(/\s+/g, '')}`}
      data-testid={testId}
      aria-label={`Call DCL at ${dclCompany.phoneDisplay}`}
      className={linkClassName}
    >
      {dclCompany.phoneDisplay}
    </a>
  );
}
