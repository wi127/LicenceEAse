"use server";

import pdf from 'pdf-parse';
import Tesseract from 'tesseract.js'

export async function runOCROnPDFBuffer(pdfBuffer: Buffer | Uint8Array, contentType = "application/pdf"): Promise<string> {
    if (contentType !== "application/pdf") {
        throw new Error("Document must be PDF.");
    }
    
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    try {
    const res = await pdf(buffer);
    if (res.text && res.text.trim().length > 50) {
      return res.text;
    }
    } catch (err) {
        console.error("PDF parsing failed:", err);
    }

    try {
        const { data } = await Tesseract.recognize(buffer, "eng");
        return data.text;
    } catch (err) {
        throw new Error("Both PDF parsing and OCR failed.");
    }
}