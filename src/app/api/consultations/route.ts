import { NextResponse } from "next/server";

/**
 * 상담 요청 목록/생성 API.
 *
 * 현재는 클라이언트가 localStorage 기반 store(`@/lib/consultations/store`)를
 * 직접 사용합니다. 백엔드 연결 시 이 라우트가 진짜 DB CRUD를 담당하게 되며,
 * Prisma 모델 ConsultationRequest와 1:1 매핑됩니다.
 *
 * Request body (POST) shape:
 *   { companyId: string, projectId?: string, title: string, message: string,
 *     budgetWon?: number, desiredArea?: string,
 *     contact?: string, requesterName?: string }
 *
 * Response (POST):
 *   { id, status: "REQUESTED", createdAt }
 */
export async function GET() {
  return NextResponse.json(
    {
      message: "현재는 클라이언트 localStorage 스토어를 사용합니다.",
      hint: "src/lib/consultations/store.ts 의 listConsultationsForUser()를 사용하세요.",
    },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message: "현재는 클라이언트 localStorage 스토어를 사용합니다.",
      hint: "src/lib/consultations/store.ts 의 createConsultation()을 사용하세요.",
    },
    { status: 501 },
  );
}
