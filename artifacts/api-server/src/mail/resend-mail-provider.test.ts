import { afterEach, describe, expect, it, vi } from "vitest";
import { ResendMailProvider } from "./resend-mail-provider";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

describe("ResendMailProvider", () => {
  afterEach(() => {
    send.mockReset();
  });

  it("sends from and replies-to the configured from-address", async () => {
    send.mockResolvedValue({ data: { id: "email-id" }, error: null });
    const provider = new ResendMailProvider("re_test_key", "info@dcl-consulting-group.com", "DCL Consulting and Investments Limited");

    await provider.sendMail({ to: "visitor@example.com", subject: "Subject", html: "<p>hi</p>", text: "hi" });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "DCL Consulting and Investments Limited <info@dcl-consulting-group.com>",
        replyTo: "info@dcl-consulting-group.com",
        to: "visitor@example.com",
      }),
    );
  });

  it("throws when Resend reports an error", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const provider = new ResendMailProvider("re_test_key", "info@dcl-consulting-group.com", "DCL");

    await expect(
      provider.sendMail({ to: "visitor@example.com", subject: "Subject", html: "<p>hi</p>", text: "hi" }),
    ).rejects.toThrow(/domain not verified/);
  });
});
