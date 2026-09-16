import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { FileOtpChallengeStore } from "./otp-challenge-store";

// Wrap writeFile in a spy-able vi.fn that calls through to the real
// implementation by default, so a single test can force exactly one write
// to fail (mockImplementationOnce) without a native ESM
// "module namespace is not configurable" error, and without affecting any
// other test's writes.
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return { ...actual, writeFile: vi.fn(actual.writeFile) };
});

let dir: string;
let store: FileOtpChallengeStore;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "otp-store-test-"));
  store = new FileOtpChallengeStore(path.join(dir, "challenges.json"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("FileOtpChallengeStore", () => {
  it("creates and retrieves a challenge with the expected defaults", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const found = await store.getById(created.id);
    expect(found).toEqual(created);
    expect(found?.deliveryStatus).toBe("pending");
    expect(found?.verified).toBe(false);
    expect(found?.attemptCount).toBe(0);
  });

  it("replaceOtp swaps the hash, resets attempts, and bumps resendCount", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.incrementAttempts(created.id);
    const replaced = await store.replaceOtp(created.id, "hash2", 10 * 60 * 1000);
    expect(replaced.otpHash).toBe("hash2");
    expect(replaced.attemptCount).toBe(0);
    expect(replaced.resendCount).toBe(1);
  });

  it("tracks attempt count across calls", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.incrementAttempts(created.id);
    const twice = await store.incrementAttempts(created.id);
    expect(twice.attemptCount).toBe(2);
  });

  it("marks verified with a timestamp", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const verified = await store.markVerified(created.id);
    expect(verified.verified).toBe(true);
    expect(verified.verifiedAt).not.toBeNull();
  });

  it("tracks delivery status transitions", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.setDeliveryStatus(created.id, "sending");
    const sent = await store.setDeliveryStatus(created.id, "sent");
    expect(sent.deliveryStatus).toBe("sent");
  });

  it("invalidate removes the challenge", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await store.invalidate(created.id);
    expect(await store.getById(created.id)).toBeUndefined();
  });

  it("persists to disk and is readable from a fresh store instance", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    const secondInstance = new FileOtpChallengeStore(path.join(dir, "challenges.json"));
    const found = await secondInstance.getById(created.id);
    expect(found?.id).toBe(created.id);
    expect(found?.email).toBe("visitor@example.com");
  });

  it("throws a clear error when mutating an unknown id", async () => {
    await expect(store.incrementAttempts("does-not-exist")).rejects.toThrow(/No OTP challenge/);
  });

  it("recovers after a single failed write instead of permanently poisoning future writes", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);

    // Force exactly one write to fail. Windows filesystem permission
    // semantics don't reliably block a same-user write via chmod the way
    // POSIX does, so a mocked writeFile (see vi.mock above) is the reliable
    // cross-platform way to simulate a transient disk error for exactly one
    // call, then fall back to the real implementation for every call after.
    (writeFile as unknown as Mock).mockImplementationOnce(async () => {
      throw new Error("simulated disk failure");
    });

    await expect(store.incrementAttempts(created.id)).rejects.toThrow(/simulated disk failure/);

    // A later write must succeed normally - the failure above must not have
    // permanently disabled persistence via a poisoned writeQueue.
    const recovered = await store.incrementAttempts(created.id);
    expect(recovered.attemptCount).toBeGreaterThan(0);
  });

  it("handles concurrent writes without corrupting the file", async () => {
    const created = await store.create("visitor@example.com", "hash1", 10 * 60 * 1000);
    await Promise.all([
      store.incrementAttempts(created.id),
      store.incrementAttempts(created.id),
      store.incrementAttempts(created.id),
    ]);
    const final = await store.getById(created.id);
    expect(final?.attemptCount).toBe(3);
  });
});
