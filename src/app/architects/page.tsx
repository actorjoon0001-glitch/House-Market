import Link from "next/link";
import LegalNotice from "@/components/LegalNotice";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  type BuildSpecialty,
} from "@/lib/demo/architects";

const FILTERS: { key: "ALL" | BuildSpecialty; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "STAY_REST_HOUSE", label: SPECIALTY_LABEL.STAY_REST_HOUSE },
  { key: "MOBILE_HOUSE", label: SPECIALTY_LABEL.MOBILE_HOUSE },
  { key: "COUNTRY_HOUSE", label: SPECIALTY_LABEL.COUNTRY_HOUSE },
  { key: "PASSIVE_HOUSE", label: SPECIALTY_LABEL.PASSIVE_HOUSE },
  { key: "REMODEL", label: SPECIALTY_LABEL.REMODEL },
];

export default function ArchitectsPage({
  searchParams,
}: {
  searchParams: { specialty?: string };
}) {
  const active = (searchParams.specialty ?? "ALL") as "ALL" | BuildSpecialty;
  const list =
    active === "ALL"
      ? DEMO_ARCHITECTS
      : DEMO_ARCHITECTS.filter((a) =>
          a.specialties.includes(active as BuildSpecialty),
        );

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">전국 입점 업체</h1>
          <p className="mt-1 text-sm text-gray-500">
            체류형 쉼터 · 이동식 주택 · 전원주택 · 패시브하우스 · 리모델링
          </p>
        </div>
        <Link
          href="/apply"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          + 우리 업체 입점 신청
        </Link>
      </header>

      <LegalNotice variant="banner" />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = active === f.key;
          return (
            <Link
              key={f.key}
              href={
                f.key === "ALL" ? "/architects" : `/architects?specialty=${f.key}`
              }
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        총 <strong>{list.length}</strong>개 업체
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <li key={a.id}>
            <Link
              href={`/architects/${a.id}`}
              className="block rounded-2xl border border-gray-100 p-4 transition hover:border-brand-100 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">
                  샘플
                </span>
                <p className="text-xs text-gray-400">{a.region}</p>
              </div>
              <p className="mt-1 text-base font-semibold">{a.name}</p>
              <p className="mt-1 text-sm text-gray-600">{a.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                    style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                  >
                    {SPECIALTY_LABEL[s]}
                  </span>
                ))}
              </div>
              {a.rating && (
                <p className="mt-2 text-xs text-gray-500">
                  ⭐ {a.rating} · 후기 {a.reviewCount}개
                </p>
              )}
              <p className="mt-3 text-xs text-gray-400">📍 {a.address}</p>
              <p className="mt-3 text-xs font-semibold text-brand">
                상담 요청하기 →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
