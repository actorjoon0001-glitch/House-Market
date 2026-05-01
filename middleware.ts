import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 경로:
     * - _next/static / _next/image / favicon
     * - API 라우트 (별도 처리 필요시 풀어주세요)
     * - 정적 파일
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
