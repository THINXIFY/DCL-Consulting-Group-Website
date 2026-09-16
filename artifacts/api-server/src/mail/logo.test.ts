import { describe, expect, it } from "vitest";
import { loadLogo } from "./logo";

describe("loadLogo", () => {
  it("loads the DCL logo as a non-empty PNG buffer", async () => {
    const logo = await loadLogo();
    expect(Buffer.isBuffer(logo)).toBe(true);
    // PNG file signature
    expect(logo.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("returns the same cached buffer on repeated calls", async () => {
    const first = await loadLogo();
    const second = await loadLogo();
    expect(first).toBe(second);
  });
});
