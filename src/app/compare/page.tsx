"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import { listFavoriteCompanyIds } from "@/lib/consultations/store";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_LABEL,
  visibilityPolicy,
  type DemoArchitect,
} from "@/lib/demo/architects";

const MAX = 3;

export default function ComparePage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    const ids = listFavoriteCompanyIds();
    setFavIds(ids);
    setPicked(ids.slice(0, MAX));
  }, []);

  const favorites = useMemo(
    () => DEMO_ARCHITECTS.filter((a) => favIds.includes(a.id)),
    [favIds],
  );
  const selected = useMemo(
    () => DEMO_ARCHITECTS.filter((a) => picked.includes(a.id)),
    [picked],
  );

  function toggle(id: string) {
    setPicked((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= MAX) return cur;
      return [...cur, id];
    });
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">업체 비교</h1>
        <p className="mt-1 text-sm text-gray-500">
          관심 업체 중 최대 {MAX}개를 선택해 한눈에 비교하세요.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-3xl">♡</p>
          <p className="text-sm font-semibold text-gray-700">
            먼저 관심 업체를 저장하세요
          </p>
          <Link
            href="/architects"
            className="mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            전문가 찾기
          </Link>
        </div>
      ) : (
        <>
          <section>
            <p className="mb-2 text-xs font-semibold text-gray-700">
              비교할 업체 선택 ({picked.length}/{MAX})
            </p>
            <div className="flex flex-wrap gap-2">
              {favorites.map((a) => {
                const on = picked.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {on ? "✓ " : ""}
                    {a.name}
                  </button>
                );
              })}
            </div>
          </section>

          {selected.length === 0 ? (
            <p className="text-sm text-gray-400">
              위에서 비교할 업체를 선택해 주세요.
            </p>
          ) : (
            <ComparisonTable selected={selected} />
          )}
        </>
      )}

      <LegalNotice />
    </div>
  );
}

function ComparisonTable({ selected }: { selected: DemoArchitect[] }) {
  const rows: { label: string; render: (a: DemoArchitect) => React.ReactNode }[] = [
    {
      label: "카테고리",
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700"
            >
              {SPECIALTY_LABEL[s]}
            </span>
          ))}
        </div>
      ),
    },
    { label: "지역", render: (a) => a.region },
    {
      label: "서비스 지역",
      render: (a) => a.serviceAreas.join(", ") || "-",
    },
    {
      label: "입점 상태",
      render: (a) => {
        const p = visibilityPolicy(a);
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.badge.cls}`}
          >
            {p.badge.label}
          </span>
        );
      },
    },
    {
      label: "상담 가능",
      render: (a) =>
        a.verifiedStatus === "verified" ? (
          <span className="text-green-700">✓ 가능</span>
        ) : (
          <span className="text-gray-400">불가</span>
        ),
    },
    {
      label: "후기",
      render: (a) =>
        a.reviewCount !== undefined ? `${a.reviewCount}개` : "-",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-600">
              항목
            </th>
            {selected.map((a) => (
              <th
                key={a.id}
                className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-800"
              >
                {a.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="border-b border-gray-100 px-3 py-2 text-xs text-gray-500">
                {row.label}
              </td>
              {selected.map((a) => (
                <td
                  key={a.id}
                  className="border-b border-gray-100 px-3 py-2 text-xs text-gray-800"
                >
                  {row.render(a)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="px-3 py-3" />
            {selected.map((a) => (
              <td key={a.id} className="px-3 py-3">
                {a.verifiedStatus === "verified" ? (
                  <Link
                    href={`/architects/${a.id}#consult`}
                    className="block rounded-xl bg-brand py-2 text-center text-xs font-semibold text-white"
                  >
                    상담 요청
                  </Link>
                ) : (
                  <Link
                    href={`/architects/${a.id}`}
                    className="block rounded-xl border border-gray-200 py-2 text-center text-xs"
                  >
                    상세 보기
                  </Link>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
