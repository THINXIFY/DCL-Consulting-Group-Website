import { LOGO_CONTENT_ID } from "../logo";

export interface DocumentsEmailInput {
  publicSiteUrl: string;
}

const BLUE = "#8bbfe8";
const INK = "#080a0d";
const MUTED = "#9ca3aa";

export function renderDocumentsEmailHtml(_input: DocumentsEmailInput): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your requested DCL documents</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f4f6;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#f2f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Your requested DCL documents are attached to this email.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;border:1px solid #e3e6e8;">
            <tr>
              <td style="padding:32px 40px 24px;background-color:${INK};">
                <img src="cid:${LOGO_CONTENT_ID}" alt="DCL Consulting and Investments Limited" width="197" height="28" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 0;">
                <span style="display:inline-block;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${INK};border:1px solid ${BLUE};padding:6px 12px;">Verified Delivery</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 0;">
                <p style="margin:0;font-size:24px;line-height:30px;color:${INK};font-weight:bold;">Your requested documents</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 0;">
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Dear Recipient,</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Thank you for verifying your email address.</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">Please find the requested DCL documents attached to this email.</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${INK};">If you have any questions or would like to discuss how DCL may support your objectives, we would be pleased to hear from you.</p>
                <p style="margin:0;font-size:15px;line-height:24px;color:${INK};">Kind regards,<br />DCL Consulting and Investments Limited</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 24px;border-top:1px solid #e3e6e8;">
                <p style="margin:0;font-size:12px;line-height:18px;color:${MUTED};">This email was sent following a verified document request through dcl-consulting-group.com.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderDocumentsEmailText(_input: DocumentsEmailInput): string {
  return [
    "DCL Consulting and Investments Limited",
    "",
    "VERIFIED DELIVERY",
    "",
    "Your requested documents",
    "",
    "Dear Recipient,",
    "",
    "Thank you for verifying your email address.",
    "",
    "Please find the requested DCL documents attached to this email.",
    "",
    "If you have any questions or would like to discuss how DCL may support your objectives, we would be pleased to hear from you.",
    "",
    "Kind regards,",
    "DCL Consulting and Investments Limited",
    "",
    "This email was sent following a verified document request through dcl-consulting-group.com.",
  ].join("\n");
}
