# Request-info documents

PDFs in this folder are emailed to visitors who verify their email through
the "Request More Info" flow on `/contact`. This folder is **not** served
publicly - it's read server-side only, by `src/lib/documents.ts`.

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
[`../README.md`](../README.md) for the full requirement and why. As
long as that holds, reading files from this folder at request time
works the same in development and production. If this ever moves to a
genuinely ephemeral/serverless or multi-instance runtime, these files
would need to move to object storage instead - the
`loadEnabledDocuments` function is the only place that would need to
change.
