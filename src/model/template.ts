// src/model/template.ts

/**
 * RURA Regulatory Checkpoints per Category. 
 * The system uses these to verify that the document content matches the applied license.
 */
export const RURA_REGULATIONS: Record<string, string[]> = {
    "Network Service Provider": [
        "99.9% UPTIME",
        "EMERGENCY SERVICE PLAN",
        "TIME TO REPAIR",
        "INTERNET CAPACITY"
    ],
    "Network Infrastructure": [
        "48-CORE FIBRE",
        "CELL ON WHEELS",
        "PASSIVE INVENTORY",
        "TOWER"
    ],
    "Application Service Provider": [
        "SYSTEM ARCHITECTURE",
        "SECURITY COMPLIANCE",
        "VALUE PROPOSITION",
        "SOFTWARE"
    ]
};

export const TEMPLATE_DOCTYPE: Record<string, string> = {
    BUSINESS_PLAN: `
Template: BUSINESS_PLAN v2 (Regulatory Aware)
Required sections (order required):
1. HEADER: "Business Name", "Business ID or TIN Number", "Issue Date"
2. EXECUTIVE SUMMARY
3. FINANCIALS

Rules:
- Section titles must match exactly.
- Category Check: Content must include at least 50% of the RURA keywords for the selected License Category.
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

Regulatory Rule:
- Terms must reflect the SLA and technical obligations for the specific license category.
`,
    OTHER_DOCUMENT: `
Template: GENERIC_DOCUMENT v1
Rules:
- Lighter checks: must contain "Business Name" and "Business ID or TIN Number".
`,
};