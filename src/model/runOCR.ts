import {PDFParse} from 'pdf-parse'
import Tesseract from 'tesseract.js'

export async function runOCROnPDFBuffer(pdfBuffer: Buffer | Uint8Array, contentType = "application/pdf"): Promise<string> {
    try{
        if (contentType === "application/pdf") {
            const parse = new PDFParse(pdfBuffer);
            const data = await parse.getText()
            if (data.text && data.text.trim().length > 50) {
                return data.text
            }
        }
    }catch(err){
        console.error("PDF parsing failed, falling back to OCR:", err)
    }

    try{
        const imgBuffer = pdfBuffer instanceof Uint8Array ? Buffer.from(pdfBuffer) : pdfBuffer;
        const { data } = await Tesseract.recognize(imgBuffer, 'eng', {
            logger: m => console.log(m)
        });
        return data.text
    } catch(err){
        console.error("OCR failed:", err)
        throw new Error("Both PDF parsing and OCR failed.")
    }
}