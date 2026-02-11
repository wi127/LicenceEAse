// src/model/template.ts
export const TEMPLATE_DOCTYPE: Record<string, string> = {
    BUSINESS_PLAN: `
Template: BUSINESS_PLAN v1
Required sections (order required):
1. HEADER: "Business Name", "Business ID or TIN Number", "Issue Date"
2. EXECUTIVE SUMMARY
3. FINANCIALS

Rules:
- Section titles must match exactly (case-insensitive but exact words).
- Business ID format as TIN number: 6-20 alphanumeric characters.
- Issue Date format: YYYY-MM-DD.
`,
    RDB_CERTIFICATE: `
Template: RDB_CERTIFICATE v1
Required sections (order required):
1. HEADER: "RWANDA", "DEVELOPMENT BOARD", "ORG", "Office of the Registrar General"
2. Registered Office Address: "Email", "Phone Number", "Address"
3. Management details: "Name", "ID Document"
4. VERIFICATION: "Serial No", "rdb.rw"

Rules:
- "Company Code" must be present and match DB entry.
- "Company Name" must be present and match DB entry.
- "Date of Issuance" format: DD/MM/YYYY.
- "ID Document" number must be 16 characters.
- Verification must contain the serial number and the rdb.rw validity link.
`,
    COMPANY_CONTRACT: `
Template: COMPANY_CONTRACT v1
Required sections (order required):
1. CONTRACT TITLE
2. PARTIES: "Company A", "Company B"
3. TERMS
`,
    OTHER_DOCUMENT: `
Template: GENERIC_DOCUMENT v1
Rules:
- We apply lighter checks: must contain "Business Name" and "Business ID or TIN Number".
`,
};