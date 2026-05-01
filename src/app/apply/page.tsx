"use client";

import Link from "next/link";
import { useState } from "react";
import KakaoAddressSearch, {
  type ResolvedAddress,
} from "@/components/KakaoAddressSearch";

const SPECIALTIES = [
  "체류형 쉼터",
  "이동식 주택",
  "전원주택",
  "패시브하우스",
  "리모델링",
];

export default function ApplyPage() {
  const [address, setAddress] = useState<ResolvedAddress | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  function toggleSpec(s: string) {
    setPicked((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:max-w-2xl md:py-10">
      <header>
        <Link href="/" className="text-xs text-brand">
          ← 홈으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">업체 입점 신청</h1>
        <p className="mt-1 text-sm text-gray-500">
          본인 동의 후 사업자번호 검증을 거쳐 지도와 디렉토리에 노출됩니다.
        </p>
      </header>

      <form className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-5">
        <Field label="대표자 성함">
          <input
            type="text"
            placeholder="홍길동"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="회사명">
          <input
            type="text"
            placeholder="○○건축사사무소"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="사업자등록번호">
          <input
            type="text"
            placeholder="000-00-00000"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>
        <Field label="대표 연락처">
          <input
            type="tel"
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

        <label className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
          <input type="checkbox" className="mt-0.5 accent-brand" />
          <span>
            개인정보(상호·주소·연락처) 공개 노출에 동의합니다. 동의 철회 시
            지도/디렉토리에서 즉시 제거됩니다.
          </span>
        </label>

        <button
          type="button"
          className="rounded-xl bg-brand py-3 text-base font-semibold text-white"
        >
          신청 제출
        </button>
        <p className="text-center text-xs text-gray-400">
          제출 후 사업자번호 검증·승인까지 영업일 기준 1~2일 소요됩니다.
        </p>
      </form>
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
