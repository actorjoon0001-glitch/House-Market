/**
 * Supabase 환경변수 헬퍼.
 * 키가 없을 때 앱 전체가 죽지 않도록 명시적으로 체크.
 *
 * 필요한 환경변수:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

export function getSupabaseEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
