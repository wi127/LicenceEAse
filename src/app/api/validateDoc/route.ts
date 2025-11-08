import { NextResponse } from "next/server";
import { validateDocWithAI } from "@/model/validateDocWithAI";

export async function POST(request: Request) {
  try {
    const { docId } = await request.json();
    const res = await validateDocWithAI(docId);
    return NextResponse.json(res);
  } catch (err: any) {
    console.error("/api/validateDoc failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
