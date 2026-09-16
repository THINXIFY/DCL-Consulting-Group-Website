export interface RequestInfoDocument {
  id: string;
  /** Human-readable filename the recipient sees as the email attachment. */
  filename: string;
  /** Path relative to artifacts/api-server/private/documents/. */
  filePath: string;
  enabled: boolean;
}

export const requestInfoDocuments: RequestInfoDocument[] = [
  {
    id: "company-profile",
    filename: "DCL-Company-Profile.pdf",
    filePath: "company-profile.pdf",
    enabled: true,
  },
  {
    id: "services-overview",
    filename: "DCL-Services-Overview.pdf",
    filePath: "services-overview.pdf",
    enabled: true,
  },
];
