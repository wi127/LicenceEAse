"use server";

import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";

export async function runOCROnPDFBuffer(
  pdfBuffer: Buffer | Uint8Array,
  contentType = "application/pdf"
): Promise<string> {

  if (contentType !== "application/pdf") {
    throw new Error("Document must be a PDF.");
  }

  // Ensure safe buffer
  const buffer = Buffer.isBuffer(pdfBuffer)
    ? pdfBuffer
    : Buffer.from(pdfBuffer);

  console.log("Starting document processing...");

  // --------------------------------
  // STEP 1 — Native PDF text extraction
  // --------------------------------
  try {

    console.log("Attempting native PDF text extraction...");

    const res = await pdf(buffer);

    if (res.text && res.text.trim().length > 100) {
      console.log("PDF text extraction succeeded.");
      return res.text;
    }

    console.log("PDF contains little text — switching to OCR.");

  } catch (err) {

    console.warn("PDF parsing failed. Falling back to OCR.");

  }

  // --------------------------------
  // STEP 2 — Convert PDF to image
  // --------------------------------
  try {

    console.log("Converting PDF page to image...");

    const converter = fromBuffer(buffer, {
      density: 300,
      format: "png",
      width: 2000,
      height: 2000,
      savePath: "/tmp"
    });

    const page = await converter(1); // first page

    if (!page.path) {
      throw new Error("PDF to image conversion failed.");
    }

    console.log("PDF converted to image:", page.path);

    // --------------------------------
    // STEP 3 — OCR with Tesseract
    // --------------------------------

    console.log("Running Tesseract OCR...");

    const { data } = await Tesseract.recognize(
      page.path,
      "eng",
      {
        logger: (m) => {
          if (m.status === "recognizing text") {
            console.log(
              `OCR Progress: ${(m.progress * 100).toFixed(0)}%`
            );
          }
        }
      }
    );

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("OCR returned empty text.");
    }

    console.log("OCR extraction successful.");

    return data.text;

  } catch (err) {

    console.error("OCR pipeline failed:", err);

    throw new Error("Both PDF parsing and OCR failed.");

  }

}