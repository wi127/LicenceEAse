"use server";

import { validateDocWithAI } from "@/model/validateDocWithAI";

export async function validateDocumentServer(docId: string) {
  return await validateDocWithAI(docId);
}
