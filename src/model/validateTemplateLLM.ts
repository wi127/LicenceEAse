
<<<<<<< HEAD
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
=======
const OPENAI_API_KEY = process.env.OPENAI_API_KEY 
>>>>>>> d689fa0803573f57ec1174c90b951b6a0a6e67af
const OPENAI_MODEL = process.env.OPENAI_MODEL

async function callOpenAI(prompt: Array<{role: string, content: string}>){
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL || 'gpt-4o-mini',
            messages: prompt,
            max_tokens: 1200,
            temperature: 0,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI API error ${res.status}: ${text}`);
    }
    const data = await res.json();
    //return data.choices[0].message.content;
    return data;
}

export async function validateTemplateWithLLM(ocrText: string, docType: string) {
    const { TEMPLATE_DOCTYPE } = await import('./template');

    const template = TEMPLATE_DOCTYPE[docType] ?? TEMPLATE_DOCTYPE['OTHER_DOCUMENT'];

    const system = `
    You are a strict document validator. You will compare OCR_TEXT against a TEMPLATE.
    Return JSON ONLY, nothing else. Use the schema exactly.

    SCHEMA:
    {
        "status": "APPROVED" | "REJECTED" | "PENDING_REVIEW",
        "templateMatch": boolean,
        "missingSections": [string],
        "extracted": { "businessName"?: {value:string, confidence:number}, "businessId"?: {value:string, confidence:number}, "issueDate"?: {value:string, confidence:number}, ... },
        "reasons": [string],
        "confidence": number  // 0..1 aggregate
    }
    `;

      const user = `
    TEMPLATE:
    ${template}

    OCR_TEXT (first 30000 chars):
    ${ocrText.slice(0, 30000)}
    `;

    const res = await callOpenAI([{role: 'system', content: system}, {role: 'user', content: user}]);
    const content = res.choices[0].message.content

    try {
        const parsed = JSON.parse(content);
        return parsed;
    } catch (err) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                const parsed = JSON.parse(match[0]);
                return parsed;
            } catch (err2) {
                throw new Error(`Failed to parse JSON from LLM response: ${err2}\nResponse was: ${content}`);
            }
    }
       throw new Error("OpenAI did not return valid JSON: " + content.slice(0, 500));
    }
}