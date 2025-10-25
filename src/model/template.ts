export const TEMPLATE_DOCTYPE: Record<string, string> = {
  BUSINESS_PLAN: `
Template: BUSINESS_PLAN v1
Required sections (order required):
1. HEADER: "Business Name", "Business ID", "Issue Date"
2. EXECUTIVE SUMMARY
3. FINANCIALS
4. SIGNATURE / DECLARATION

Rules:
- Section titles must match exactly (case-insensitive but exact words).
- Business ID format as TIN number: 6-20 alphanumeric characters.
- Issue Date format: YYYY-MM-DD.
`,
  RDB_CERTIFICATE: `
Template: RDB_CERTIFICATE v1
Required sections (order required):
1. HEADER: "RDB CERTIFICATE", "Business Name", "Business ID or TIN number"
2. ISSUED_ON (YYYY-MM-DD)
3. OFFICIAL SEAL or SIGNATURE
Rules:
- "TIN number" must be present and match DB entry.
`,
  COMPANY_CONTRACT: `
Template: COMPANY_CONTRACT v1
Required sections (order required):
1. CONTRACT TITLE
2. PARTIES: "Company A", "Company B"
3. TERMS
4. SIGNATURE BLOCK
Rules:
- Must include signature block.
`,
  OTHER_DOCUMENT: `
Template: GENERIC_DOCUMENT v1
Rules:
- We apply lighter checks: must contain "Business Name" and "Business ID".
`,
};
