import { readFile } from "node:fs/promises";
import path from "node:path";
import { findPackageRoot } from "../lib/documents";

const LOGO_PATH = path.join(findPackageRoot(import.meta.dirname), "private", "assets", "dcl-logo.png");

export const LOGO_CONTENT_ID = "dcl-logo";

let cached: Buffer | null = null;

/** Loaded once and cached in memory - the logo never changes during a process's lifetime. */
export async function loadLogo(): Promise<Buffer> {
  if (!cached) {
    cached = await readFile(LOGO_PATH);
  }
  return cached;
}
