"use server";

import prisma from "@/lib/prisma";
import { runOCROnPDFBuffer } from "./runOCR";
import { validateTemplateWithLLM } from "./validateTemplateLLM";
import { fetchRequiredDocumentById } from "@/action/RequiredDocument";


export async function validateDocWithAI(docId: string, options = { updateApplicationDocument: true }) {
    const requiredDoc = await fetchRequiredDocumentById(docId, { id: true, name: true, documentType: true, file: true, companyId: true });

    if (!requiredDoc) {
        throw new Error(`Required document not found:  ${docId}`);
    }

    const ocrText = await runOCROnPDFBuffer(requiredDoc.file as Buffer, "application/pdf");

    let validationResult;
    try {
        validationResult = await validateTemplateWithLLM(ocrText, requiredDoc.documentType);
    } catch (err: any) {
        console.error("LLM validation failed", err);

        if (options.updateApplicationDocument) {
            await prisma.applicationDocument.updateMany({
                where: { requiredDocumentId: docId },
                data: {
                    status: "PENDING",
                    reason: `AI validation error: ${err.message || err}`,
                    updatedAt: new Date(),
                }
            });
        }
        throw new Error(`Document validation failed for docId ${docId}: ${err}`);
    }

    let finalStatus: "APPROVED" | "REJECTED" | "PENDING" = "REJECTED";

    const statusFromLLM = validationResult?.status ?? "REJECTED";
    const templateMatch = !!validationResult?.templateMatch;
    const confidence = typeof validationResult?.confidence === "number" ? validationResult.confidence : 0;

    if (statusFromLLM === "APPROVED" && templateMatch && confidence >= 0.7) finalStatus = "APPROVED";
    else if (confidence >= 0.5 && statusFromLLM === "APPROVED") finalStatus = "PENDING";
    else finalStatus = "REJECTED";

    if (options.updateApplicationDocument) {
    await prisma.applicationDocument.updateMany({
        where: { requiredDocumentId: docId },
      data: {
        status: finalStatus === "APPROVED" ? "APPROVED" : "REJECTED",
        extractedJson: validationResult.extracted || {},
        reason: (validationResult.reasons || []).join("; "),
        confidence: confidence,
        rawOcrText: ocrText.slice(0, 5000),
        updatedAt: new Date(),
      }
    }).catch(e => {
      console.warn("documentValidation create failed or maybe model not present:", e.message);
    });
}
    return {
    docId,
    finalStatus,
    validationResult,
  };
}