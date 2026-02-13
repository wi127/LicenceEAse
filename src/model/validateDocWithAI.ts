"use server";

import prisma from "@/lib/prisma";
import { runOCROnPDFBuffer } from "./runOCR";
import { validateTemplateWithLLM } from "./validateTemplateLLM";
import { fetchRequiredDocumentById } from "@/action/RequiredDocument";
import { RURA_REGULATIONS } from "./template";

export async function validateDocWithAI(docId: string, options = { updateApplicationDocument: true }) {
    // 1. Fetch document and explicitly include Company and Application data
    const requiredDoc: any = await prisma.requiredDocument.findUnique({
        where: { id: docId },
        include: { 
            company: true,
            applications: true // This ensures application data is available
        }
    });

    if (!requiredDoc) throw new Error(`Required document not found: ${docId}`);

    const ocrText = await runOCROnPDFBuffer(requiredDoc.file as Buffer, "application/pdf");
    const cleanOcr = ocrText.toUpperCase();
    
    // Use the application name (e.g., "Network Service Provider") as the RURA category
    const category = requiredDoc.application?.name || "Application Service Provider";

    let validationResult: any = { status: "REJECTED", confidence: 0, reasons: [] };
    let localPassed = false;
    let regulatoryEvidence: string[] = [];

    // --- 2. REGULATORY FUZZY MATCH (The "Receptionist" Logic) ---
    const categoryKeywords = RURA_REGULATIONS[category] || [];
    const matchedKeywords = categoryKeywords.filter(kw => cleanOcr.includes(kw));
    
    // We expect at least 2 key regulatory markers to prove categorical match
    const hasCategoryProof = matchedKeywords.length >= 2;
    if (hasCategoryProof) {
        regulatoryEvidence.push(`RURA Check: Verified ${matchedKeywords.join(", ")} for ${category}`);
    }

    // --- 3. DYNAMIC FUZZY MATCH (RDB Certificate) ---
    if (requiredDoc.documentType === 'RDB_CERTIFICATE') {
        const headerKeywords = ["RWANDA", "DEVELOPMENT BOARD", "REGISTRAR"];
        const foundHeaderCount = headerKeywords.filter(word => cleanOcr.includes(word)).length;

        const expectedName = requiredDoc.company?.name?.toUpperCase() || "";
        const expectedTIN = requiredDoc.company?.TIN || "";
        
        const nameMatch = expectedName && cleanOcr.includes(expectedName.split(' ')[0]); 
        const codeMatch = expectedTIN && cleanOcr.includes(expectedTIN);

        if (foundHeaderCount >= 2 && nameMatch && codeMatch) {
            localPassed = true;
            console.log(`Dynamic Match Success: ${expectedName}`);
        }
    }

    try {
        // 4. Pass category to the updated AI function
        validationResult = await validateTemplateWithLLM(ocrText, requiredDoc.documentType, category);
        
        // Categorical enforcement: Reject if document doesn't match the applied category
        if (!hasCategoryProof && requiredDoc.documentType !== 'RDB_CERTIFICATE') {
            validationResult.status = "REJECTED";
            validationResult.reasons.push(`CATEGORICAL MISMATCH: No ${category} evidence found.`);
        }

        if (localPassed) {
            validationResult.status = "APPROVED";
            validationResult.templateMatch = true;
            validationResult.confidence = 1.0;
            validationResult.reasons = [...(validationResult.reasons || []), "Verified via Dynamic Local Match", ...regulatoryEvidence];
        }
    } catch (err: any) {
        if (localPassed) {
            validationResult = { 
                status: "APPROVED", 
                templateMatch: true, 
                confidence: 0.9, 
                reasons: ["AI Error: Fallback to Local Proof"] 
            };
        } else {
            throw err;
        }
    }

    const finalStatus = (validationResult.status === "APPROVED") ? "APPROVED" : "REJECTED";

    if (options.updateApplicationDocument) {
        await prisma.applicationDocument.updateMany({
            where: { requiredDocumentId: docId },
            data: {
                status: finalStatus,
                extractedJson: validationResult.extracted || {},
                reason: (validationResult.reasons || []).join("; "),
                confidence: validationResult.confidence,
                rawOcrText: ocrText.slice(0, 5000),
                updatedAt: new Date(),
            }
        });
    }

    return { docId, finalStatus, validationResult };
}