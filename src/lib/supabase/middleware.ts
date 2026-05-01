import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

/**
 * 모든 요청에서 Supabase 세션을 갱신.
 * 환경변수가 없으면 그대로 통과.
 */
export async function updateSupabaseSession(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) return NextResponse.next({ request: { headers: request.headers } });

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
