// template.ts

export interface KeywordRule {
    keyword: string;
    variations: string[];
    required: boolean;
}

export const RURA_REGULATIONS: Record<string, KeywordRule[]> = {

    "Network Service Provider": [
        {
            keyword: "UPTIME",
            variations: ["99.9% uptime", "availability", "service availability"],
            required: true
        },
        {
            keyword: "EMERGENCY SERVICE PLAN",
            variations: ["emergency service plan", "disaster recovery", "incident escalation"],
            required: true
        },
        {
            keyword: "TIME TO REPAIR",
            variations: ["time to repair", "TTR", "fault restoration"],
            required: true
        },
        {
            keyword: "INTERNET CAPACITY",
            variations: ["internet capacity", "bandwidth", "upstream provider"],
            required: false
        }
    ],

    "Network Infrastructure": [
        {
            keyword: "48-CORE FIBRE",
            variations: ["48-core fibre", "fiber backbone", "optical fibre"],
            required: true
        },
        {
            keyword: "CELL ON WHEELS",
            variations: ["cell on wheels", "mobile base station"],
            required: false
        },
        {
            keyword: "PASSIVE INVENTORY",
            variations: ["passive inventory", "network assets"],
            required: true
        },
        {
            keyword: "TOWER",
            variations: ["tower", "telecom mast"],
            required: true
        }
    ],

    "Application Service Provider": [
        {
            keyword: "SYSTEM ARCHITECTURE",
            variations: ["system architecture", "cloud architecture", "platform design"],
            required: true
        },
        {
            keyword: "SECURITY COMPLIANCE",
            variations: ["security compliance", "data protection", "encryption"],
            required: true
        },
        {
            keyword: "VALUE PROPOSITION",
            variations: ["value proposition", "competitive advantage"],
            required: false
        },
        {
            keyword: "SOFTWARE",
            variations: ["software", "application platform"],
            required: true
        }
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
- Section titles must approximately match.
- Business ID format as TIN number: Exactly 9 digits.
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
- Must contain "Business Name" and "Business ID or TIN Number".
`,
};