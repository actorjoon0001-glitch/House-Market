import { NextResponse } from "next/server";

/**
 * 단일 상담 조회 / 상태 변경.
 * 현재는 클라이언트 localStorage 사용. 백엔드 연결 시 활성화.
 *
 * GET  → ConsultationRequest 단건
 * PATCH body: { status: "READ" | "REPLIED" | "CLOSED" }
 */
export async function GET() {
  return NextResponse.json({ message: "use client store" }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ message: "use client store" }, { status: 501 });
}
