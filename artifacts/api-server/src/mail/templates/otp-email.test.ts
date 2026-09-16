import { describe, expect, it } from "vitest";
import { renderOtpEmailHtml, renderOtpEmailText } from "./otp-email";

const input = { code: "384271", ttlMinutes: 10, publicSiteUrl: "https://dcl-consulting-group.com" };

describe("otp email template", () => {
  it("html includes the code and expiry", () => {
    const html = renderOtpEmailHtml(input);
    expect(html).toContain("384271");
    expect(html).toContain("10 minutes");
    expect(html).toContain("dcl-consulting-group.com");
  });

  it("text version includes the same essentials", () => {
    const text = renderOtpEmailText(input);
    expect(text).toContain("384271");
    expect(text).toContain("10 minutes");
  });

  it("does not invent an email address, phone number, or office hours", () => {
    const html = renderOtpEmailHtml(input).toLowerCase();
    expect(html).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/);
    expect(html).not.toContain("office hours");
  });

  it("never mentions attachments (the OTP email must not carry PDFs)", () => {
    const html = renderOtpEmailHtml(input).toLowerCase();
    expect(html).not.toContain("attach");
  });

  it("references the logo via cid, not a remote URL", () => {
    const html = renderOtpEmailHtml(input);
    expect(html).toContain('src="cid:dcl-logo"');
    expect(html).not.toContain("images/brand/dcl-logo.png");
  });
});
