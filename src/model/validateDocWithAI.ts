"use server";

import prisma from "@/lib/prisma";
import { runOCROnPDFBuffer } from "./runOCR";
import { validateTemplateWithLLM } from "./validateTemplateLLM";
import { fetchRequiredDocumentById } from "@/action/RequiredDocument";

/**
 OCR numeric normalization
 Fix common Tesseract mistakes
*/
function normalizeOCRNumbers(text: string) {
  return text
    .replace(/O/g, "0")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/B/g, "8")
    .replace(/S/g, "5");
}

export async function validateDocWithAI(
  docId: string,
  options = { updateApplicationDocument: true }
) {

  const requiredDoc = await fetchRequiredDocumentById(docId, {
    id: true,
    name: true,
    documentType: true,
    file: true,
    companyId: true
  });

  if (!requiredDoc) {
    throw new Error(`Required document not found: ${docId}`);
  }

  const ocrText = await runOCROnPDFBuffer(
    requiredDoc.file as Buffer,
    "application/pdf"
  );

  const cleanOcr = ocrText.toUpperCase();

  let validationResult: any = {
    status: "REJECTED",
    confidence: 0,
    reasons: []
  };

  let skipAI = false;

  /**
   ========================================
   RDB CERTIFICATE VALIDATION
   ========================================
   */

  if (requiredDoc.documentType === "RDB_CERTIFICATE") {

    const company = await prisma.company.findUnique({
      where: { id: requiredDoc.companyId },
      select: { name: true, TIN: true }
    });

    if (!company) throw new Error("Company not found");

    const dbTIN = company.TIN.replace(/\s/g, "");

    /**
     Normalize OCR numbers
    */
    const normalizedOCR = normalizeOCRNumbers(cleanOcr);

    /**
     Extract exactly 9-digit Company Code
    */
    const tinMatch = normalizedOCR.match(/\b\d{9}\b/);

    const extractedTIN = tinMatch ? tinMatch[0] : null;

    if (!extractedTIN) {

      validationResult = {
        status: "REJECTED",
        confidence: 0.9,
        reasons: [
          "Company Code not detected or invalid format (must be exactly 9 digits)"
        ]
      };

      skipAI = true;

    } else if (extractedTIN.length !== 9) {

      validationResult = {
        status: "REJECTED",
        confidence: 1,
        reasons: [
          "Company Code must contain exactly 9 digits"
        ]
      };

      skipAI = true;

    } else if (extractedTIN !== dbTIN) {

      validationResult = {
        status: "REJECTED",
        confidence: 1,
        reasons: [
          `Company Code mismatch. Certificate: ${extractedTIN}, Database: ${dbTIN}`
        ]
      };

      skipAI = true;

    } else {

      validationResult = {
        status: "APPROVED",
        confidence: 1,
        reasons: [
          "Certificate verified: Company Code matches database"
        ]
      };

      skipAI = true;

      console.log("Certificate validated locally using Company Code.");
    }
  }

  /**
   ========================================
   BUSINESS PLAN VALIDATION
   ========================================
   */

  if (!skipAI && requiredDoc.documentType === "BUSINESS_PLAN") {

    const keywords = [
      "UPTIME",
      "EMERGENCY SERVICE PLAN",
      "TIME TO REPAIR"
    ];

    const found = keywords.filter(word =>
      cleanOcr.includes(word)
    );

    if (found.length >= 2) {

      validationResult = {
        status: "APPROVED",
        confidence: 0.9,
        reasons: [
          "Business plan validated using regulatory keywords"
        ]
      };

      skipAI = true;

      console.log("Business plan passed keyword validation.");
    }
  }

  /**
   ========================================
   AI VALIDATION FALLBACK
   ========================================
   */

  if (!skipAI) {

    try {

      validationResult = await validateTemplateWithLLM(
        ocrText,
        requiredDoc.documentType
      );

    } catch (err) {

      console.error("AI validation failed:", err);

      validationResult = {
        status: "REJECTED",
        confidence: 0,
        reasons: ["AI validation failed"]
      };
    }
  }

  const finalStatus =
    validationResult.status === "APPROVED"
      ? "APPROVED"
      : "REJECTED";

  /**
   ========================================
   DATABASE UPDATE
   ========================================
   */

  if (options.updateApplicationDocument) {

    await prisma.applicationDocument.updateMany({
      where: { requiredDocumentId: docId },
      data: {
        status: finalStatus,
        extractedJson: validationResult.extracted || {},
        reason: (validationResult.reasons || []).join("; "),
        confidence: validationResult.confidence,
        rawOcrText: ocrText.slice(0, 5000),
        updatedAt: new Date()
      }
    });
  }

  return {
    docId,
    finalStatus,
    validationResult
  };
}