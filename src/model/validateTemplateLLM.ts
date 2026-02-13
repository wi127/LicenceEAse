"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;

async function callOpenAI(prompt: Array<{ role: string, content: string }>) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: prompt,
            max_tokens: 1200,
            temperature: 0,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenRouteR API error ${res.status}: ${text}`);
    }
    return await res.json();
}

export async function validateTemplateWithLLM(ocrText: string, docType: string, category: string) {
    const { TEMPLATE_DOCTYPE } = await import('./template');
    const template = TEMPLATE_DOCTYPE[docType] ?? TEMPLATE_DOCTYPE['OTHER_DOCUMENT'];

    const system = `
    You are a strict document validator. You will compare OCR_TEXT against a TEMPLATE.
    Return JSON ONLY.

    SPECIAL RULES FOR RDB_CERTIFICATE:
    1. HEADER elements ("RWANDA", "DEVELOPMENT BOARD", "ORG", "Office of the Registrar General") may appear in any order or on separate lines.
    2. The "Official Seal" is valid if "Serial No" and "rdb.rw" are present.
    3. Accept Date format as DD/MM/YYYY.

    SCHEMA:
    {
        "status": "APPROVED" | "REJECTED" | "PENDING_REVIEW",
        "templateMatch": boolean,
        "missingSections": [string],
        "extracted": { "businessName"?: string, "businessId"?: string, "issueDate"?: string },
        "reasons": [string],
        "confidence": number
    }
    `;

    const user = `
    TEMPLATE:
    ${template}

    OCR_TEXT:
    ${ocrText.slice(0, 30000)}
    `;

    const res = await callOpenAI([{ role: 'system', content: system }, { role: 'user', content: user }]);
    const content = res.choices[0].message.content;

    try {
        return JSON.parse(content);
    } catch (err) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw new Error("OpenAI did not return valid JSON: " + content.slice(0, 500));
    }
}