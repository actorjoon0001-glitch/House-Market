import { NextResponse } from "next/server";

/**
 * 상담 메시지 목록/추가.
 * 현재는 클라이언트 localStorage 사용.
 *
 * GET  → ConsultationMessage[]
 * POST body: { senderRole: "USER" | "COMPANY", body: string }
 */
export async function GET() {
  return NextResponse.json({ message: "use client store" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: "use client store" }, { status: 501 });
}
