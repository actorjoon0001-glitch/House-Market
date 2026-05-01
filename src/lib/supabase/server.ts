import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * 서버 컴포넌트/라우트 핸들러용 Supabase 클라이언트.
 * App Router의 cookies() store를 통해 인증 세션을 읽고 갱신합니다.
 */
export function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Component에서 cookies().set은 throw할 수 있음 — middleware에서 처리됨
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // 동상
        }
      },
    },
  });
}
