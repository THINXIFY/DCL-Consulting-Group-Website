import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { requestInfoDocuments, type RequestInfoDocument } from "../../config/request-info-documents";
import { logger } from "./logger";

// Deliberately NOT `path.resolve(import.meta.dirname, "..", "..", ...)`.
// That hardcoded-depth approach works in dev (this file runs in place at
// src/lib/documents.ts, two levels below the package root) but breaks once
// `build.mjs` bundles everything into one file: esbuild collapses every
// module's `import.meta.dirname` to the *bundle's own* location (dist/,
// one level below the package root, not two), so a hardcoded ".." depth
// walks one directory too far and silently points outside the package -
// every document read then fails, and since a missing file is logged and
// skipped rather than thrown, a real visitor would receive zero
// attachments with no visible error. Walking up until we find this
// package's own package.json works identically in both dev and the bundle,
// because dist/ and src/lib/ are both (at different depths) inside the
// same package root.
export function findPackageRoot(startDir: string): string {
  let dir = startDir;
  while (!existsSync(path.join(dir, "package.json"))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not locate api-server's package.json walking up from "${startDir}".`);
    }
    dir = parent;
  }
  return dir;
}

export const DOCUMENTS_ROOT = path.join(findPackageRoot(import.meta.dirname), "private", "documents");

export interface LoadedDocument {
  filename: string;
  content: Buffer;
  contentType: string;
}

function resolveSafePath(filePath: string, root: string): string {
  const resolved = path.resolve(root, filePath);
  if (!resolved.startsWith(root + path.sep)) {
    throw new Error(`Refusing to read document outside the private documents directory: "${filePath}"`);
  }
  if (path.extname(resolved).toLowerCase() !== ".pdf") {
    throw new Error(`Refusing to read a non-PDF document: "${filePath}"`);
  }
  return resolved;
}

/**
 * Loads every enabled document from the trusted server-side manifest. A bad
 * manifest entry (path traversal, non-PDF) throws immediately - that's a
 * configuration bug, not a runtime condition. A genuinely missing file is
 * logged and skipped so one bad document never blocks the others.
 */
export async function loadEnabledDocuments(
  manifest: RequestInfoDocument[] = requestInfoDocuments,
  documentsRoot: string = DOCUMENTS_ROOT,
): Promise<LoadedDocument[]> {
  const loaded: LoadedDocument[] = [];

  for (const doc of manifest) {
    if (!doc.enabled) continue;

    const resolvedPath = resolveSafePath(doc.filePath, documentsRoot);
    try {
      const content = await readFile(resolvedPath);
      loaded.push({ filename: doc.filename, content, contentType: "application/pdf" });
    } catch (err) {
      // Include the real error (ENOENT vs. a permissions problem vs. a
      // wrong DOCUMENTS_ROOT all look identical without this) so a
      // systemic failure is distinguishable from "someone hasn't uploaded
      // this PDF yet" in the logs, even though both are handled the same
      // way here (skip this one document, keep going).
      logger.error({ documentId: doc.id, err }, "Failed to read a request-info document; skipping it");
    }
  }

  return loaded;
}
