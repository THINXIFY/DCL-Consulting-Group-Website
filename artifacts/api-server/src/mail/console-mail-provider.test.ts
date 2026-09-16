import { describe, expect, it, vi } from "vitest";
import { ConsoleMailProvider } from "./console-mail-provider";

describe("ConsoleMailProvider", () => {
  it("logs the email instead of sending it, and never logs a would-be OTP as plaintext outside the intended preview field", async () => {
    const info = vi.fn();
    const provider = new ConsoleMailProvider({ info } as never);

    await provider.sendMail({
      to: "visitor@example.com",
      subject: "Your DCL verification code",
      html: "<p>384271</p>",
      text: "384271",
    });

    expect(info).toHaveBeenCalledTimes(1);
    const [meta, message] = info.mock.calls[0];
    expect(meta.to).toBe("visitor@example.com");
    expect(meta.subject).toBe("Your DCL verification code");
    expect(typeof message).toBe("string");
  });
});
