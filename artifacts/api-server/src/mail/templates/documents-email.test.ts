import { describe, expect, it } from "vitest";
import { renderDocumentsEmailHtml, renderDocumentsEmailText } from "./documents-email";

const input = { publicSiteUrl: "https://dcl-consulting-group.com" };

describe("documents email template", () => {
  it("html includes the verified-delivery badge and company name", () => {
    const html = renderDocumentsEmailHtml(input);
    expect(html).toContain("Verified Delivery");
    expect(html).toContain("DCL Consulting and Investments Limited");
  });

  it("text version carries the same core copy", () => {
    const text = renderDocumentsEmailText(input);
    expect(text).toContain("Your requested documents");
    expect(text).toContain("DCL Consulting and Investments Limited");
  });

  it("does not invent an email address, phone number, or office hours", () => {
    const html = renderDocumentsEmailHtml(input).toLowerCase();
    expect(html).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/);
    expect(html).not.toContain("office hours");
  });
});
