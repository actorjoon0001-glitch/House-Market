export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between p-6">
      <div className="pt-12">
        <h1 className="text-2xl font-bold">집마켓에 오신 걸 환영해요</h1>
        <p className="mt-2 text-sm text-gray-500">
          전화번호로 1초만에 시작하세요
        </p>

        <form className="mt-8 flex flex-col gap-3">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="010-0000-0000"
            className="rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand py-3 text-base font-semibold text-white"
          >
            인증번호 받기
          </button>
        </form>
      </div>

      <p className="pb-4 text-center text-xs text-gray-400">
        가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </p>
    </div>
  );
}
