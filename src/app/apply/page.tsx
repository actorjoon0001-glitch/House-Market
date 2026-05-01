"use client";

import Link from "next/link";
import { useState } from "react";
import KakaoAddressSearch, {
  type ResolvedAddress,
} from "@/components/KakaoAddressSearch";
import LegalNotice from "@/components/LegalNotice";

const SPECIALTIES = [
  "체류형 쉼터",
  "이동식 주택",
  "전원주택",
  "패시브하우스",
  "리모델링",
];

type VerifyState = "idle" | "checking" | "ok" | "invalid";

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [bizNumber, setBizNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<ResolvedAddress | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");

  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDisclosure, setAgreeDisclosure] = useState(false);
  const [agreeRevoke, setAgreeRevoke] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allAgreed = agreePrivacy && agreeDisclosure && agreeRevoke;

  function toggleSpec(s: string) {
    setPicked((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  }

  function verifyBiz() {
    setVerifyState("checking");
    setTimeout(() => {
      // mock 검증: 10자리 숫자 형식 확인
      const digits = bizNumber.replace(/\D/g, "");
      setVerifyState(digits.length === 10 ? "ok" : "invalid");
    }, 700);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAgreed) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 p-4 md:max-w-2xl md:py-10">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-3 text-lg font-bold">
            입점 신청이 접수되었습니다
          </p>
          <p className="mt-2 text-sm text-gray-600">
            사업자 확인 후 노출됩니다. 영업일 기준 1~2일 내 검토 결과를 알려
            드릴게요.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <LegalNotice variant="compact" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:max-w-2xl md:py-10">
      <header>
        <Link href="/" className="text-xs text-brand">
          ← 홈으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">업체 입점 신청</h1>
        <p className="mt-1 text-sm text-gray-600">
          사업자 확인과 본인 동의 후 집마켓 지도와 디렉토리에 노출됩니다.
        </p>
      </header>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-5">
        <Field label="대표자 성함">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="회사명">
          <input
            required
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="○○건축사사무소"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field label="사업자등록번호">
          <div className="flex gap-2">
            <input
              required
              type="text"
              value={bizNumber}
              onChange={(e) => {
                setBizNumber(e.target.value);
                setVerifyState("idle");
              }}
              placeholder="000-00-00000"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={verifyBiz}
              disabled={!bizNumber || verifyState === "checking"}
              className="rounded-xl border border-brand bg-brand-50 px-3 text-xs font-medium text-brand disabled:opacity-40"
            >
              {verifyState === "checking" ? "확인중..." : "확인"}
            </button>
          </div>
          {verifyState === "ok" && (
            <p className="text-[11px] text-green-600">
              ✓ 사업자번호 형식 확인 완료 (실제 검증은 국세청 API 연동 후 처리됩니다)
            </p>
          )}
          {verifyState === "invalid" && (
            <p className="text-[11px] text-red-600">
              사업자번호 형식이 올바르지 않습니다 (10자리 숫자).
            </p>
          )}
        </Field>

        <Field label="대표 연락처">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="02-000-0000"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field label="시공 가능 카테고리 (복수 선택)">
          <div className="grid grid-cols-2 gap-2">
            {SPECIALTIES.map((s) => {
              const on = picked.includes(s);
              return (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    on
                      ? "border-brand bg-brand-50 text-brand"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleSpec(s)}
                    className="accent-brand"
                  />
                  {s}
                </label>
              );
            })}
          </div>
        </Field>

        <Field label="사무실 주소">
          <KakaoAddressSearch
            placeholder="시·도부터 입력 (예: 서울 강남구 테헤란로)"
            onResolve={setAddress}
          />
        </Field>
        {address && (
          <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            <p className="font-medium text-gray-800">📍 선택된 주소</p>
            <p className="mt-1">{address.address}</p>
            {address.roadAddress && (
              <p className="text-gray-500">{address.roadAddress}</p>
            )}
          </div>
        )}

        {/* Consents */}
        <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-700">필수 동의 항목</p>
          <Consent
            checked={agreePrivacy}
            onChange={setAgreePrivacy}
            label="개인정보 수집 및 이용에 동의합니다 (성함·연락처·사업자번호)"
          />
          <Consent
            checked={agreeDisclosure}
            onChange={setAgreeDisclosure}
            label="회사명·주소·전문 분야가 지도 및 디렉토리에 공개되는 것에 동의합니다"
          />
          <Consent
            checked={agreeRevoke}
            onChange={setAgreeRevoke}
            label="동의 철회 시 노출이 즉시 중단되며 등록 정보 삭제를 요청할 수 있음을 확인했습니다"
          />
        </div>

        <button
          type="submit"
          disabled={!allAgreed}
          className="rounded-xl bg-brand py-3 text-base font-semibold text-white disabled:opacity-40"
        >
          신청 제출
        </button>
        <p className="text-center text-xs text-gray-400">
          제출 후 사업자번호 검증·승인까지 영업일 기준 1~2일 소요됩니다.
        </p>
      </form>

      <LegalNotice />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Consent({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-brand"
      />
      <span>{label}</span>
    </label>
  );
}
