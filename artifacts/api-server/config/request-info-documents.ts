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
    id: "investment-portfolio-report-2026",
    filename: "DCL_Consulting_and_Investments_Limited_Investment_Portfolio_Report_2026.pdf",
    filePath: "DCL_Consulting_and_Investments_Limited_Investment_Portfolio_Report_2026.pdf",
    enabled: true,
  },
  {
    id: "renewable-energy-investment-portfolio",
    filename: "DCL_Consulting_and_Investments_Limited_Renewable_Energy_Investment_Portfolio.pdf",
    filePath: "DCL_Consulting_and_Investments_Limited_Renewable_Energy_Investment_Portfolio.pdf",
    enabled: true,
  },
  {
    id: "solar-farm-investment-summary",
    filename: "DCL_Consulting_and_Investments_Limited_Solar_Farm_Investment_Summary.pdf",
    filePath: "DCL_Consulting_and_Investments_Limited_Solar_Farm_Investment_Summary.pdf",
    enabled: true,
  },
  {
    id: "strategic-investment-partnerships-report",
    filename: "DCL_Consulting_and_Investments_Limited_Strategic_Investment_Partnerships_Report.pdf",
    filePath: "DCL_Consulting_and_Investments_Limited_Strategic_Investment_Partnerships_Report.pdf",
    enabled: true,
  },
  {
    id: "strategic-partnership-mercedes-benz",
    filename: "Strategic_Partnership_Agreement_Mercedes-Benz_AG_and_DCL_Consulting_and_Investments_Limited.pdf",
    filePath: "Strategic_Partnership_Agreement_Mercedes-Benz_AG_and_DCL_Consulting_and_Investments_Limited.pdf",
    enabled: true,
  },
  {
    id: "strategic-partnership-nafta-oil",
    filename: "Strategic_Partnership_Agreement_NAFTA_Oil_Company_and_DCL_Consulting_and_Investments_Limited.pdf",
    filePath: "Strategic_Partnership_Agreement_NAFTA_Oil_Company_and_DCL_Consulting_and_Investments_Limited.pdf",
    enabled: true,
  },
];
