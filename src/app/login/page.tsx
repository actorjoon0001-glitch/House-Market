"use client";

import Link from "next/link";
import { useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import { useUser } from "@/components/AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const { user, configured, loading } = useUser();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase가 설정되지 않았습니다.");
      setSending(false);
      return;
    }
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  async function signInKakao() {
    setError(null);
    setKakaoLoading(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase가 설정되지 않았습니다.");
      setKakaoLoading(false);
      return;
    }
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo,
        // 개인 개발자 카카오 앱은 동의항목 중 닉네임만 활성화 가능.
        // 다른 항목(account_email, profile_image)은 권한 없음/사용 안 함이라
        // 요청에 포함하면 KOE205로 차단됨. 닉네임 하나만 요청.
        scopes: "profile_nickname",
      },
    });
    if (error) {
      setError(error.message);
      setKakaoLoading(false);
    }
    // 성공 시 카카오 OAuth 페이지로 자동 리다이렉트되므로 finally로 풀지 않음
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-5 p-6 md:max-w-md md:mx-auto md:py-12">
      <div className="pt-4">
        <h1 className="text-2xl font-bold md:text-3xl">집마켓에 로그인</h1>
        <p className="mt-2 text-sm text-gray-500">
          이메일로 1초만에 시작하세요. 보내드리는 링크를 클릭하면 자동
          로그인됩니다.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">로딩 중...</p>
      ) : !configured ? (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-xs leading-relaxed text-yellow-800">
          <p className="font-semibold">⚠️ Supabase가 아직 연결되지 않았어요</p>
          <p className="mt-1.5">
            <code>NEXT_PUBLIC_SUPABASE_URL</code>과{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 환경변수를 Netlify에
            추가하면 이메일 매직 링크 로그인이 활성화됩니다.
          </p>
          <p className="mt-2">
            현재는 로그인 없이도 모든 데모 기능을 사용할 수 있어요 (데이터는
            브라우저에 저장).
          </p>
        </div>
      ) : user ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm">
          <p className="font-semibold">이미 로그인되어 있어요</p>
          <p className="mt-1 text-gray-600">{user.email}</p>
          <Link
            href="/me"
            className="mt-3 inline-block rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white"
          >
            내정보로 이동
          </Link>
        </div>
      ) : sent ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
          <p className="text-3xl">📬</p>
          <p className="mt-2 text-base font-bold">로그인 링크를 보냈어요</p>
          <p className="mt-1 text-sm text-gray-600">
            {email}로 보낸 메일에서 링크를 클릭하면 자동 로그인됩니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* 카카오 로그인 버튼 (먼저 표시 — 더 빠른 옵션) */}
          <button
            type="button"
            onClick={signInKakao}
            disabled={kakaoLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-base font-semibold text-[#3C1E1E] transition hover:bg-[#fdd835] disabled:opacity-60"
          >
            <span aria-hidden className="text-lg">💬</span>
            {kakaoLoading ? "이동 중..." : "카카오로 시작하기"}
          </button>

          <div className="my-1 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            또는 이메일로
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={send} className="flex flex-col gap-3">
            <input
              required
              type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-brand py-3 text-base font-semibold text-white disabled:opacity-50"
          >
            {sending ? "전송 중..." : "로그인 링크 받기"}
          </button>
            {error && (
              <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                {error}
              </p>
            )}
          </form>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </p>

      <LegalNotice variant="compact" />
    </div>
  );
}
