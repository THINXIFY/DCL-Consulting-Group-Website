import { describe, expect, it } from "vitest";
import { generateOtp, hashOtp, verifyOtp } from "./otp";

describe("otp", () => {
  it("generates a six-digit numeric string, zero-padded", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/);
    }
  });

  it("generates varied values, including some with a leading zero", () => {
    const codes = Array.from({ length: 500 }, () => generateOtp());
    expect(new Set(codes).size).toBeGreaterThan(1);
    expect(codes.some((c) => c.startsWith("0"))).toBe(true);
  });

  it("hash/verify round-trips for the correct code", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("384271", hash, "secret-a")).toBe(true);
  });

  it("rejects an incorrect code", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("905162", hash, "secret-a")).toBe(false);
  });

  it("rejects the correct code hashed under a different secret", () => {
    const hash = hashOtp("384271", "secret-a");
    expect(verifyOtp("384271", hash, "secret-b")).toBe(false);
  });
});
