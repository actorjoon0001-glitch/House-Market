"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * 브라우저에서 동작하는 Supabase 싱글톤 클라이언트.
 * 환경변수가 없으면 null을 반환하고, 호출부에서 폴백 처리.
 */
export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createBrowserClient(env.url, env.anonKey);
}
