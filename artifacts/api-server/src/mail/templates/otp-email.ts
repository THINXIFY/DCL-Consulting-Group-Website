import { LOGO_CONTENT_ID } from "../logo";

export interface OtpEmailInput {
  code: string;
  ttlMinutes: number;
  publicSiteUrl: string;
}

const BLUE = "#8bbfe8";
const INK = "#080a0d";
const MUTED = "#9ca3aa";

export function renderOtpEmailHtml({ code, ttlMinutes }: OtpEmailInput): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your DCL verification code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f4f6;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#f2f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Use this code to securely access the requested DCL documents.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${INK};max-width:600px;width:100%;">
            <tr>
              <td style="padding:32px 40px 24px;">
                <img src="cid:${LOGO_CONTENT_ID}" alt="DCL Consulting and Investments Limited" width="197" height="28" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;">
                <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${BLUE};">Secure Document Access</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;">
                <p style="margin:0;font-size:15px;line-height:22px;color:#ffffff;">Your verification code</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;">
                <div style="background-color:#171714;border:1px solid ${BLUE};padding:20px;text-align:center;">
                  <span style="font-size:32px;letter-spacing:10px;font-weight:bold;color:#ffffff;">${code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;">
                <p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};">This code will expire in ${ttlMinutes} minutes.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px;">
                <p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};">If you did not request documents from DCL, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #2a2a26;">
                <p style="margin:0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">DCL Consulting and Investments Limited</p>
                <p style="margin:4px 0 0;font-size:12px;color:${MUTED};">dcl-consulting-group.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOtpEmailText({ code, ttlMinutes }: OtpEmailInput): string {
  return [
    "DCL Consulting and Investments Limited",
    "",
    "SECURE DOCUMENT ACCESS",
    "",
    "Your verification code:",
    code,
    "",
    `This code will expire in ${ttlMinutes} minutes.`,
    "",
    "If you did not request documents from DCL, you can safely ignore this email.",
    "",
    "dcl-consulting-group.com",
  ].join("\n");
}
