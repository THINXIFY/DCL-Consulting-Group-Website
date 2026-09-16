# Request-info documents

PDFs in this folder are emailed to visitors who verify their email through
the "Request More Info" flow on `/contact`. This folder is **not** served
publicly - it's read server-side only, by `src/lib/documents.ts`, and only
after a visitor's email has been OTP-verified. There is no direct URL that
serves these files.

## ⚠ MUST REPLACE BEFORE PRODUCTION LAUNCH

`company-profile.pdf` and `services-overview.pdf` are **development
placeholders**, not approved marketing collateral - generated from facts
already public on the DCL site, with a disclaimer to that effect printed
on the PDF itself. They're left in place so the feature stays functional
for testing, but they must be swapped for real, approved documents (same
filenames, or update the manifest below) before this goes live.

## Adding a document

1. Drop a `.pdf` file into this folder.
2. Add an entry to `config/request-info-documents.ts`:

   ```ts
   {
     id: "unique-id",
     filename: "DCL-Human-Readable-Name.pdf", // shown as the email attachment name
     filePath: "your-file.pdf",               // relative to this folder
     enabled: true,
   }
   ```

## Supported file type

`.pdf` only. Any other extension is rejected before it's read.

## Disabling a document

Set `enabled: false` on its manifest entry - no need to delete the file or
touch delivery code.

## Attachment size

Resend's attachment limit applies to the *sum* of all enabled documents.
Keep each PDF modest (a few MB at most); the delivery code sums attachment
sizes before sending and marks delivery `failed` (with a log entry) rather
than silently dropping documents if the total is too large.

## Deployment

This server must run as a real, persistent Node process on a
single-instance host with a persistent disk - see the top-level
[`../README.md`](../README.md) for the full requirement and why
(production target: Render, see `render.yaml` at the repository root).
As long as that holds, reading files from this folder at request time
works the same in development and production. Unlike the OTP challenge
store, these PDFs are version-controlled deployment assets, not runtime
data - they're part of the Git deploy, not written to the Persistent
Disk. If this ever moves to a genuinely ephemeral/serverless or
multi-instance runtime, these files would need to move to object
storage instead - the `loadEnabledDocuments` function is the only place
that would need to change.
